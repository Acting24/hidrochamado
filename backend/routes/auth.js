import express from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Autentica um usuário
 */
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('senha').notEmpty().withMessage('Senha é obrigatória')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, senha } = req.body;

    try {
      const result = await pool.query(
        'SELECT * FROM usuarios WHERE email = $1 AND ativo = true',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      const usuario = result.rows[0];
      const senhaValida = await bcryptjs.compare(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      const token = jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
          funcao: usuario.funcao,
          nome: usuario.nome
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '24h' }
      );

      res.json({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          funcao: usuario.funcao
        }
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }
);

/**
 * POST /api/auth/registrar
 * Registra um novo usuário
 */
router.post(
  '/registrar',
  [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().normalizeEmail(),
    body('senha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('funcao').isIn(['admin', 'agente', 'solicitante']).withMessage('Função inválida')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, email, senha, funcao, telefone } = req.body;

    try {
      // Verificar se email já existe
      const existente = await pool.query(
        'SELECT id FROM usuarios WHERE email = $1',
        [email]
      );

      if (existente.rows.length > 0) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Hash da senha
      const senhaHash = await bcryptjs.hash(senha, 10);

      const result = await pool.query(
        'INSERT INTO usuarios (nome, email, senha, funcao, telefone) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, funcao',
        [nome, email, senhaHash, funcao, telefone]
      );

      const novoUsuario = result.rows[0];

      res.status(201).json({
        message: 'Usuário registrado com sucesso',
        usuario: novoUsuario
      });
    } catch (error) {
      console.error('Erro ao registrar:', error);
      res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  }
);

export default router;
