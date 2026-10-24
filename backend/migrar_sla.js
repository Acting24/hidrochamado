import { pool, connectDatabase } from './config/database.js';

async function migrarSlaTodosChamados() {
  console.log('🔄 Conectando ao banco de dados...');
  await connectDatabase();

  try {
    // Busca todos os chamados da tabela
    let res;
    if (typeof pool.query === 'function') {
      res = await pool.query("SELECT id, prioridade, data_criacao FROM chamados");
    } else {
      const stmt = pool.prepare("SELECT id, prioridade, data_criacao FROM chamados");
      res = { rows: stmt.all() };
    }

    const chamados = res.rows || res;
    console.log(`📋 Atualizando SLA de todos os ${chamados.length} chamados...`);

    for (const chamado of chamados) {
      let horasSLA = 72; // Padrão: baixa / media
      if (chamado.prioridade === 'alta') horasSLA = 24;
      if (chamado.prioridade === 'critica') horasSLA = 4;

      // Utiliza a data de criação do chamado para determinar a data limite
      const dataBase = chamado.data_criacao ? new Date(chamado.data_criacao) : new Date();
      dataBase.setHours(dataBase.getHours() + horasSLA);
      const slaLimite = dataBase.toISOString();

      if (typeof pool.query === 'function') {
        await pool.query('UPDATE chamados SET sla_limite = ? WHERE id = ?', [slaLimite, chamado.id]);
      } else {
        const stmtUpdate = pool.prepare('UPDATE chamados SET sla_limite = ? WHERE id = ?');
        stmtUpdate.run(slaLimite, chamado.id);
      }
    }

    console.log('🎉 Todos os chamados da base de dados foram atualizados com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao migrar SLA:', error);
    process.exit(1);
  }
}

migrarSlaTodosChamados();