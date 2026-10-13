// Inicializa o banco de dados SQLite criando as tabelas do schema
import initSqlJs from 'sql.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'database', 'hidrochamado.db');
const SCHEMA_PATH = path.join(__dirname, 'schema-sqlite.sql');

console.log('🚀 Inicializando banco de dados SQLite (sql.js)...');
console.log('   Arquivo do banco:', DB_PATH);

// Garante que o diretório existe
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

async function main() {
  console.log('📦 Carregando sql.js (WASM)...');
  const SQL = await initSqlJs();

  // Carrega banco existente ou cria novo
  let db;
  if (fs.existsSync(DB_PATH) && fs.statSync(DB_PATH).size > 0) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
    console.log('📂 Banco existente carregado');
  } else {
    db = new SQL.Database();
    console.log('📄 Novo banco criado');
  }

  try {
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
    // sql.js: db.run aceita múltiplos statements quando passados como string única
    db.run(schema);
    console.log('✅ Schema aplicado com sucesso!');

    // Persiste no arquivo
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
    console.log('💾 Banco salvo em disco');

    // Verifica tabelas criadas
    const tablesResult = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    const tables = tablesResult[0]?.values?.map(v => v[0]) || [];
    console.log('📊 Tabelas criadas:', tables.join(', '));

    // Conta categorias
    const catsResult = db.exec('SELECT COUNT(*) as total FROM categorias');
    const totalCats = catsResult[0]?.values?.[0]?.[0] || 0;
    console.log(`🏷️  Categorias cadastradas: ${totalCats}`);
  } catch (error) {
    console.error('❌ Erro ao aplicar schema:', error.message);
    process.exit(1);
  } finally {
    db.close();
  }

  console.log('\n✅ Banco de dados pronto para uso!');
  console.log('   Para popular com dados de teste, rode: npm run seed');
}

main();
