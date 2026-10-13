import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { pool } from '../config/database.js';
import { autenticar, autorizar } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/chamados
 * Criar novo chamado
 */
router.post(
  '/',
  autenticar,
  [
    body('titulo').notEmpty().withMessage('Título é obrigatório'),
    body('descricao').notEmpty().withMessage('Descrição é obrigatória'),
    body('categoria_id').isInt().withMessage('Categoria inválida'),
    body('prioridade').isIn(['baixa', 'media', 'alta', 'critica']).optional(),
    body('cep').optional().matches(/^\d{5}-?\d{3}$/).withMessage('CEP inválido')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { titulo, descricao, categoria_id, prioridade = 'media', cep, endereco, cidade, bairro } = req.body;
    const usuario_id = req.usuario.id;

    try {
      // Gerar número único do chamado
      const numeroChamado = `HC-${Date.now()}`;

      const result = await pool.query(
        `INSERT INTO chamados 
        (numero_chamado, titulo, descricao, categoria_id, usuario_solicitante_id, prioridade, cep, endereco, cidade, bairro) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING *`,
        [numeroChamado, titulo, descricao, categoria_id, usuario_id, prioridade, cep, endereco, cidade, bairro]
      );

      const chamado = result.rows[0];

      res.status(201).json({
        message: 'Chamado criado com sucesso',
        chamado
      });
    } catch (error) {
      console.error('Erro ao criar chamado:', error);
      res.status(500).json({ error: 'Erro ao criar chamado' });
    }
  }
);

/**
 * GET /api/chamados
 * Listar chamados com filtros
 */
router.get(
  '/',
  autenticar,
  async (req, res) => {
    const { status, prioridade, pagina = 1, limite = 10 } = req.query;

    try {
      let query = 'SELECT * FROM chamados WHERE 1=1';
      const params = [];

      if (status) {
        query += ' AND status = $' + (params.length + 1);
        params.push(status);
      }

      if (prioridade) {
        query += ' AND prioridade = $' + (params.length + 1);
        params.push(prioridade);
      }

      // Filtro por função do usuário
      if (req.usuario.funcao === 'solicitante') {
        query += ' AND usuario_solicitante_id = $' + (params.length + 1);
        params.push(req.usuario.id);
      } else if (req.usuario.funcao === 'agente') {
        query += ' AND (usuario_agente_id = $' + (params.length + 1) + ' OR usuario_agente_id IS NULL)';
        params.push(req.usuario.id);
      }

      // Paginação
      const offset = (pagina - 1) * limite;
      query += ' ORDER BY data_criacao DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limite, offset);

      const result = await pool.query(query, params);

      res.json({
        chamados: result.rows,
        pagina,
        limite,
        total: result.rows.length
      });
    } catch (error) {
      console.error('Erro ao listar chamados:', error);
      res.status(500).json({ error: 'Erro ao listar chamados' });
    }
  }
);

/**
 * GET /api/chamados/:id
 * Obter detalhes de um chamado
 */
router.get('/:id', autenticar, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM chamados WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chamado não encontrado' });
    }

    const chamado = result.rows[0];

    // Verificar permissão
    if (req.usuario.funcao === 'solicitante' && chamado.usuario_solicitante_id !== req.usuario.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Buscar atividades
    const atividades = await pool.query(
      'SELECT * FROM atividades WHERE chamado_id = $1 ORDER BY data_atividade DESC',
      [id]
    );

    res.json({
      chamado,
      atividades: atividades.rows
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
      // Verificar permissões
      const chamado = await pool.query('SELECT * FROM chamados WHERE id = $1', [id]);
      if (chamado.rows.length === 0) {
        return res.status(404).json({ error: 'Chamado não encontrado' });
      }

      if (req.usuario.funcao !== 'admin' && chamado.rows[0].usuario_agente_id !== req.usuario.id) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      // Atualizar chamado
      const resultado = await pool.query(
        'UPDATE chamados SET status = COALESCE($1, status), observacoes = COALESCE($2, observacoes) WHERE id = $3 RETURNING *',
        [status, observacoes, id]
      );

      // Registrar atividade
      if (status) {
        await pool.query(
          'INSERT INTO atividades (chamado_id, usuario_id, tipo_atividade, status_anterior, status_novo) VALUES ($1, $2, $3, $4, $5)',
          [id, req.usuario.id, 'status_alterado', chamado.rows[0].status, status]
        );
      }

      res.json({
        message: 'Chamado atualizado com sucesso',
        chamado: resultado.rows[0]
      });
    } catch (error) {
      console.error('Erro ao atualizar chamado:', error);
      res.status(500).json({ error: 'Erro ao atualizar chamado' });
    }
  }
);

export default router;
