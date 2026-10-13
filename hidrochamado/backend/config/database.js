// Adaptador de banco de dados SQLite usando sql.js (WASM puro, sem dependências nativas)
// Compatível com qualquer versão do Node.js, evita crashes do Node 24 com bindings nativos.
//
// Imite a interface da Pool do pg para que o código escrito para PostgreSQL
// funcione sem alterações nos arquivos de rotas.

import initSqlJs from 'sql.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'database', 'hidrochamado.db');

// Garante que o diretório do banco exista
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let SQL = null;
let db = null;
let saveTimer = null;

/**
 * Converte placeholders do estilo PostgreSQL ($1, $2, ...) para SQLite (?)
 */
function convertPlaceholders(sql) {
  return sql.replace(/\$(\d+)/g, '?');
}

/**
 * Traduz algumas funções/expressões específicas do PostgreSQL para SQLite.
 */
function translatePgFunctions(sql) {
  return sql
    // Remove casts PostgreSQL (::numeric, ::INT, etc.)
    .replace(/::\w+(?:\s*\([^)]*\))?/g, '')
    // NOW() -> datetime('now')
    .replace(/\bNOW\(\)/g, "datetime('now')")
    // INTERVAL 'X days' -> modifiers SQLite ('-X days')
    .replace(/\bINTERVAL\s+'(\d+)\s+(\w+)'/g, "'-$1 $2'");
}

/**
 * Persiste o banco em arquivo (debounced para evitar I/O excessivo).
 */
function persistDb() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      if (!db) return;
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(DB_PATH, buffer);
    } catch (err) {
      console.error('⚠️  Erro ao salvar banco:', err.message);
    }
  }, 250);
}

// Wrapper que imita a interface da Pool do pg
export const pool = {
  /**
   * Executa uma query SQL (async, compatível com pg)
   * @param {string} text - SQL com placeholders $1, $2, ...
   * @param {Array} params - parâmetros
   * @returns {Promise<{rows: Array}>}
   */
  async query(text, params = []) {
    if (!db) {
      throw new Error('Banco de dados não inicializado. Chame connectDatabase() primeiro.');
    }
    try {
      const sql = convertPlaceholders(translatePgFunctions(text));
      const trimmed = text.trim().toUpperCase();

      // Statements que retornam linhas
      if (trimmed.startsWith('SELECT') ||
          trimmed.startsWith('PRAGMA') ||
          trimmed.startsWith('WITH') ||
          trimmed.includes('RETURNING')) {
        // Usa prepare + step para obter linhas
        const stmt = db.prepare(sql);
        try {
          stmt.bind(params);
          const rows = [];
          while (stmt.step()) {
            rows.push(stmt.getAsObject());
          }
          return { rows };
        } finally {
          stmt.free();
        }
      } else {
        // INSERT/UPDATE/DELETE sem RETURNING
        db.run(sql, params);
        persistDb();
        // Tenta obter last_insert_rowid
        const lastIdResult = db.exec('SELECT last_insert_rowid() AS id');
        const lastInsertRowid = lastIdResult[0]?.values?.[0]?.[0] ?? null;
        return { rows: [], rowCount: db.getRowsModified(), lastInsertRowid };
      }
    } catch (error) {
      console.error('❌ Erro SQL:', error.message);
      console.error('   SQL:', text.trim().substring(0, 200));
      throw error;
    }
  },

  async connect() {
    return {
      release() { /* no-op */ },
      query: (text, params) => pool.query(text, params)
    };
  },

  async end() {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    if (db) {
      // Persiste antes de fechar
      try {
        const data = db.export();
        fs.writeFileSync(DB_PATH, Buffer.from(data));
      } catch (_) { /* ignora */ }
      db.close();
      db = null;
    }
  },

  on(_event, _handler) {
    // no-op para compatibilidade
  },

  // Acesso direto para init-db.js aplicar schema via db.run/exec
  _getDb() { return db; },
  _setDb(newDb) { db = newDb; },
  _getSqlModule() { return SQL; },
  _setSqlModule(newSql) { SQL = newSql; },
  _persistDb: persistDb
};

export async function connectDatabase() {
  try {
    if (!SQL) {
      SQL = await initSqlJs();
    }
    // Se o arquivo existe, carrega; senão cria banco novo
    if (fs.existsSync(DB_PATH) && fs.statSync(DB_PATH).size > 0) {
      const buffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
      // Persiste imediatamente para criar o arquivo
      const data = db.export();
      fs.writeFileSync(DB_PATH, Buffer.from(data));
    }
    const result = db.exec("SELECT 1 AS ok");
    if (result && result.length > 0 && result[0].values[0][0] === 1) {
      console.log('✅ Banco de dados SQLite conectado com sucesso');
      console.log('   Arquivo:', DB_PATH);
    } else {
      throw new Error('Teste de conexão falhou');
    }
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
}

export default pool;
