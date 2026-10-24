import express from 'express';
import { pool } from '../config/database.js';
import { autenticar, autorizar } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/relatorios/dashboard
 * Dados para o dashboard
 */
router.get('/dashboard', autenticar, async (req, res) => {
  try {
    // Total de chamados por status
    const statusResult = await pool.query(`
      SELECT status, COUNT(*) as total
      FROM chamados
      GROUP BY status
      ORDER BY total DESC
    `);

    // Total de chamados por prioridade
    const prioridadeResult = await pool.query(`
      SELECT prioridade, COUNT(*) as total
      FROM chamados
      GROUP BY prioridade
      ORDER BY CASE
        WHEN prioridade = 'critica' THEN 1
        WHEN prioridade = 'alta' THEN 2
        WHEN prioridade = 'media' THEN 3
        WHEN prioridade = 'baixa' THEN 4
      END
    `);

    // Chamados por categoria
    const categoriaResult = await pool.query(`
      SELECT c.nome, COUNT(ch.id) as total
      FROM categorias c
      LEFT JOIN chamados ch ON c.id = ch.categoria_id
      GROUP BY c.nome
      ORDER BY total DESC
    `);

    // Tempo médio de resolução (SQLite: usa strftime para calcular diferença em horas)
    const tempoResult = await pool.query(`
      SELECT
        CAST(AVG((julianday(data_resolucao) - julianday(data_criacao)) * 24) AS INTEGER) as horas_media,
        CAST(MIN((julianday(data_resolucao) - julianday(data_criacao)) * 24) AS INTEGER) as horas_minimo,
        CAST(MAX((julianday(data_resolucao) - julianday(data_criacao)) * 24) AS INTEGER) as horas_maximo
      FROM chamados
      WHERE data_resolucao IS NOT NULL
    `);

    // Chamados por data (últimos 30 dias) - SQLite: datetime('now','-30 days')
    const dataResult = await pool.query(`
      SELECT
        DATE(data_criacao) as data,
        COUNT(*) as total
      FROM chamados
      WHERE data_criacao >= datetime('now','-30 days')
      GROUP BY DATE(data_criacao)
      ORDER BY data DESC
    `);

    // Estatísticas gerais
    const totalResult = await pool.query(`
      SELECT
        COUNT(*) as total_chamados,
        COUNT(CASE WHEN status = 'resolvido' OR status = 'fechado' THEN 1 END) as resolvidos,
        COUNT(CASE WHEN data_criacao >= datetime('now','-7 days') THEN 1 END) as criados_ultima_semana
      FROM chamados
    `);

    res.json({
      por_status: statusResult.rows,
      por_prioridade: prioridadeResult.rows,
      por_categoria: categoriaResult.rows,
      tempo_resolucao: tempoResult.rows[0],
      por_data: dataResult.rows,
      totais: totalResult.rows[0]
    });
  } catch (error) {
    console.error('Erro ao gerar relatório dashboard:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
});

/**
 * GET /api/relatorios/sla
 * Relatório de SLA
 */
router.get('/sla', autenticar, autorizar('admin', 'agente'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        ch.numero_chamado,
        ch.titulo,
        ch.status,
        ch.prioridade,
        ch.data_criacao,
        ch.sla_limite,
        CASE
          WHEN ch.status IN ('resolvido', 'fechado') THEN 'Atendido'
          WHEN ch.sla_limite < datetime('now') AND ch.status NOT IN ('resolvido', 'fechado') THEN 'Vencido'
          ELSE 'No Prazo'
        END as sla_status,
        CAST((julianday(datetime('now')) - julianday(ch.data_criacao)) * 24 AS INTEGER) as horas_aberto
      FROM chamados ch
      WHERE ch.status NOT IN ('resolvido', 'fechado')
      ORDER BY ch.sla_limite ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao gerar relatório SLA:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
});

/**
 * GET /api/relatorios/desempenho-agentes
 * Relatório de desempenho dos agentes
 */
router.get(
  '/desempenho-agentes',
  autenticar,
  autorizar('admin'),
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          u.id,
          u.nome,
          COUNT(ch.id) as total_chamados,
          COUNT(CASE WHEN ch.status IN ('resolvido', 'fechado') THEN 1 END) as resolvidos,
          ROUND(COUNT(CASE WHEN ch.status IN ('resolvido', 'fechado') THEN 1 END) * 1.0 /
                NULLIF(COUNT(ch.id), 0) * 100, 2) as taxa_resolucao,
          ROUND(AVG((julianday(ch.data_resolucao) - julianday(ch.data_criacao)) * 24), 2) as tempo_medio_horas
        FROM usuarios u
        LEFT JOIN chamados ch ON u.id = ch.usuario_agente_id
        WHERE u.funcao = 'agente'
        GROUP BY u.id, u.nome
        ORDER BY total_chamados DESC
      `);

      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao gerar relatório de desempenho:', error);
      res.status(500).json({ error: 'Erro ao gerar relatório' });
    }
  }
);

export default router;
