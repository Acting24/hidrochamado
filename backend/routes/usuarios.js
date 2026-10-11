import express from 'express';
import { pool } from '../config/database.js';
import { autenticar, autorizar } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/usuarios/perfil
 * Obter perfil do usuário autenticado
 */
router.get('/perfil', autenticar, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nome, email, funcao, telefone, departamento FROM usuarios WHERE id = $1',
      [req.usuario.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({ error: 'Erro ao obter perfil' });
  }
});

/**
 * GET /api/usuarios
 * Listar usuários (apenas admin)
 */
router.get(
  '/',
  autenticar,
  autorizar('admin'),
  async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT id, nome, email, funcao, telefone, departamento, ativo, data_criacao FROM usuarios ORDER BY nome'
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ error: 'Erro ao listar usuários' });
    }
  }
);

/**
 * GET /api/usuarios/agentes
 * Listar apenas agentes
 */
router.get('/agentes', autenticar, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nome, email FROM usuarios WHERE funcao = $1 AND ativo = true ORDER BY nome',
      ['agente']
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar agentes:', error);
    res.status(500).json({ error: 'Erro ao listar agentes' });
  }
});

export default router;
