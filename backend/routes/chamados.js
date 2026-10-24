import express from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database.js';
import { autenticar } from '../middleware/auth.js';

const router = express.Router();

/**
 * Helper para executar querys no pool de forma resiliente
 */
async function executarQuery(sql, params = []) {
  if (typeof pool.query === 'function') {
    return await pool.query(sql, params);
  } else if (typeof pool.prepare === 'function') {
    const stmt = pool.prepare(sql);
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return { rows: stmt.all(...params) };
    } else {
      const info = stmt.run(...params);
      return { rows: [], lastID: info.lastInsertRowid, changes: info.changes };
    }
  } else {
    throw new Error('Método de banco de dados incompatível no pool.');
  }
}

/**
 * POST /api/chamados
 * Criar novo chamado com cálculo automático de SLA
 */
router.post(
  '/',
  autenticar,
  [
    body('titulo').notEmpty().withMessage('Título é obrigatório'),
    body('descricao').notEmpty().withMessage('Descrição é obrigatória'),
    body('categoria_id').isInt().withMessage('Categoria inválida')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        titulo,
        descricao,
        categoria_id,
        prioridade = 'media',
        cep = '',
        endereco = '',
        cidade = '',
        bairro = ''
      } = req.body;

      // --- CÁLCULO DO SLA BASEADO NA PRIORIDADE ---
      let horasSLA = 72; // Padrão: baixa / media (72h)
      if (prioridade === 'alta') horasSLA = 24;     // 24h
      if (prioridade === 'critica') horasSLA = 4;   // 4h

      const dataAtual = new Date();
      dataAtual.setHours(dataAtual.getHours() + horasSLA);
      const sla_limite = dataAtual.toISOString();

      // Gera um número único de chamado para satisfazer a restrição NOT NULL
      const numeroChamado = `HC-${Date.now()}`;

      const sql = `INSERT INTO chamados 
        (numero_chamado, titulo, descricao, categoria_id, prioridade, cep, endereco, cidade, bairro, usuario_solicitante_id, status, sla_limite, data_criacao) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'aberto', ?, datetime('now'))`;

      const params = [
        numeroChamado,
        titulo,
        descricao,
        Number(categoria_id),
        prioridade,
        cep || null,
        endereco || null,
        cidade || null,
        bairro || null,
        req.usuario.id,
        sla_limite
      ];

      const resInsert = await executarQuery(sql, params);
      const novoId = resInsert.lastID || (resInsert.rows && resInsert.rows[0]?.id);

      return res.status(201).json({
        mensagem: 'Chamado criado com sucesso!',
        chamado_id: novoId,
        numero_chamado: numeroChamado,
        sla_limite
      });
    } catch (error) {
      console.error('Erro ao criar chamado:', error);
      return res.status(500).json({ mensagem: 'Erro interno ao criar chamado.', detalhe: error.message });
    }
  }
);

/**
 * GET /api/chamados
 * Listar chamados com filtros
 */
router.get('/', autenticar, async (req, res) => {
  // Força o navegador a não armazenar a resposta em cache
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const { status, prioridade } = req.query;

  try {
    let sql = 'SELECT * FROM chamados WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (prioridade) {
      sql += ' AND prioridade = ?';
      params.push(prioridade);
    }

    if (req.usuario.funcao === 'solicitante') {
      sql += ' AND usuario_solicitante_id = ?';
      params.push(req.usuario.id);
    } else if (req.usuario.funcao === 'agente') {
      sql += ' AND (usuario_agente_id = ? OR usuario_agente_id IS NULL)';
      params.push(req.usuario.id);
    }

    sql += ' ORDER BY id DESC';

    const resultado = await executarQuery(sql, params);
    const lista = resultado.rows || resultado;

    res.json({
      chamados: lista || [],
      total: lista ? lista.length : 0
    });
  } catch (error) {
    console.error('Erro ao listar chamados:', error);
    res.status(500).json({ error: 'Erro ao listar chamados' });
  }
});
/**
 * GET /api/chamados/:id
 * Obter detalhes de um chamado
 */
router.get('/:id', autenticar, async (req, res) => {
  const { id } = req.params;

  try {
    const resChamado = await executarQuery('SELECT * FROM chamados WHERE id = ?', [id]);
    const chamado = (resChamado.rows || resChamado)[0];

    if (!chamado) {
      return res.status(404).json({ error: 'Chamado não encontrado' });
    }

    if (req.usuario.funcao === 'solicitante' && chamado.usuario_solicitante_id !== req.usuario.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const resAtividades = await executarQuery('SELECT * FROM atividades WHERE chamado_id = ? ORDER BY id DESC', [id]);

    res.json({
      chamado,
      atividades: resAtividades.rows || resAtividades || []
    });
  } catch (error) {
    console.error('Erro ao obter chamado:', error);
    res.status(500).json({ error: 'Erro ao obter chamado' });
  }
});

/**
 * PUT /api/chamados/:id
 * Atualizar status do chamado
 */
router.put(
  '/:id',
  autenticar,
  [
    body('status').isIn(['aberto', 'em_andamento', 'em_pausa', 'resolvido', 'fechado']).optional(),
    body('observacoes').optional()
  ],
  async (req, res) => {
    const { id } = req.params;
    const { status, observacoes } = req.body;

    try {
      const resChamado = await executarQuery('SELECT * FROM chamados WHERE id = ?', [id]);
      const chamado = (resChamado.rows || resChamado)[0];

      if (!chamado) {
        return res.status(404).json({ error: 'Chamado não encontrado' });
      }

      if (req.usuario.funcao !== 'admin' && chamado.usuario_agente_id !== req.usuario.id) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const novoStatus = status || chamado.status;
      const novasObs = observacoes !== undefined ? observacoes : chamado.observacoes;

      await executarQuery('UPDATE chamados SET status = ?, observacoes = ? WHERE id = ?', [novoStatus, novasObs, id]);

      if (status) {
        await executarQuery(
          'INSERT INTO atividades (chamado_id, usuario_id, tipo_atividade, status_anterior, status_novo) VALUES (?, ?, ?, ?, ?)',
          [id, req.usuario.id, 'status_alterado', chamado.status, status]
        );
      }

      const resAtualizado = await executarQuery('SELECT * FROM chamados WHERE id = ?', [id]);

      res.json({
        message: 'Chamado atualizado com sucesso',
        chamado: (resAtualizado.rows || resAtualizado)[0]
      });
    } catch (error) {
      console.error('Erro ao atualizar chamado:', error);
      res.status(500).json({ error: 'Erro ao atualizar chamado' });
    }
  }
);

export default router;