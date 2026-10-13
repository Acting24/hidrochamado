import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, connectDatabase } from './config/database.js';
import chamadosRouter from './routes/chamados.js';
import usuariosRouter from './routes/usuarios.js';
import relatoriosRouter from './routes/relatorios.js';
import authRouter from './routes/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de segurança
// Desabilita CSP do helmet para permitir CDN de CSS/JS (Tailwind, Chart.js, etc.)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS flexível em desenvolvimento (permite qualquer origem, inclusive o preview HTTPS)
const isDev = (process.env.NODE_ENV || 'development') !== 'production';
app.use(cors({
  origin: isDev ? true : (process.env.FRONTEND_URL || 'http://localhost:5000'),
  credentials: true
}));

// Middleware de logging
app.use(morgan('combined'));

// Middleware de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../')));

// Rota para servir index.html na raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Rotas
app.use('/api/auth', authRouter);
app.use('/api/chamados', chamadosRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/relatorios', relatoriosRouter);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Erro interno do servidor',
      status: err.status || 500
    }
  });
});

// Iniciar servidor
async function start() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor HidroChamado rodando em http://localhost:${PORT}`);
    console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💾 Banco de dados: ${process.env.DB_TYPE || 'sqlite'}`);
  });

  // Keep-alive para garantir que o event loop do Node nunca fique vazio,
  // evitando encerramento inesperado quando usado com WASM (sql.js) e shell.
  // NÃO usar .unref() aqui - queremos que este timer mantenha o processo vivo.
  const keepAlive = setInterval(() => {
    // no-op, apenas mantém o Node vivo
  }, 30000);

  // Captura sinais para fechar o banco graciosamente
  process.on('SIGTERM', async () => {
    console.log('SIGTERM recebido, fechando...');
    clearInterval(keepAlive);
    await pool.end();
    process.exit(0);
  });
  process.on('SIGINT', async () => {
    console.log('SIGINT recebido, fechando...');
    clearInterval(keepAlive);
    await pool.end();
    process.exit(0);
  });

  // Log de exceções não capturadas para diagnóstico
  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught exception:', err);
  });
  process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled rejection:', err);
  });
}

start().catch(err => {
  console.error('❌ Falha ao iniciar servidor:', err);
  process.exit(1);
});

export default app;