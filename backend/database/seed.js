import { pool } from '../config/database.js';
import bcryptjs from 'bcryptjs';

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Criar usuários de teste
    const usuariosData = [
      {
        nome: 'Admin SABESP',
        email: 'admin@sabesp.com.br',
        senha: await bcryptjs.hash('admin123', 10),
        funcao: 'admin',
        telefone: '(11) 3000-0000',
        departamento: 'Administração'
      },
      {
        nome: 'Carlos Silva',
        email: 'carlos@sabesp.com.br',
        senha: await bcryptjs.hash('123456', 10),
        funcao: 'agente',
        telefone: '(11) 3001-0001',
        departamento: 'Atendimento'
      },
      {
        nome: 'Maria Santos',
        email: 'maria@sabesp.com.br',
        senha: await bcryptjs.hash('123456', 10),
        funcao: 'agente',
        telefone: '(11) 3001-0002',
        departamento: 'Atendimento'
      },
      {
        nome: 'João Oliveira',
        email: 'joao@test.com.br',
        senha: await bcryptjs.hash('123456', 10),
        funcao: 'solicitante',
        telefone: '(11) 3002-0001'
      },
      {
        nome: 'Ana Costa',
        email: 'ana@test.com.br',
        senha: await bcryptjs.hash('123456', 10),
        funcao: 'solicitante',
        telefone: '(11) 3002-0002'
      }
    ];

    for (const usuario of usuariosData) {
      await pool.query(
        'INSERT INTO usuarios (nome, email, senha, funcao, telefone, departamento) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING',
        [usuario.nome, usuario.email, usuario.senha, usuario.funcao, usuario.telefone, usuario.departamento]
      );
    }

    console.log('✅ Usuários inseridos com sucesso');

    // Obter IDs dos usuários
    const usuariosResult = await pool.query('SELECT id, email FROM usuarios');
    const usuariosMap = {};
    usuariosResult.rows.forEach(u => {
      usuariosMap[u.email] = u.id;
    });

    // Criar chamados de teste
    const chamadosData = [
      {
        numero_chamado: 'HC-2024-0001',
        titulo: 'Vazamento na Rua A',
        descricao: 'Vazamento de água descoberto na rua principal',
        categoria_id: 1,
        usuario_solicitante_id: usuariosMap['joao@test.com.br'],
        usuario_agente_id: usuariosMap['carlos@sabesp.com.br'],
        prioridade: 'alta',
        status: 'em_andamento',
        endereco: 'Rua A, 123',
        cep: '01310-100',
        cidade: 'São Paulo',
        bairro: 'Centro'
      },
      {
        numero_chamado: 'HC-2024-0002',
        titulo: 'Falta de água na Zona Leste',
        descricao: 'Região sem abastecimento há 2 horas',
        categoria_id: 2,
        usuario_solicitante_id: usuariosMap['ana@test.com.br'],
        usuario_agente_id: usuariosMap['maria@sabesp.com.br'],
        prioridade: 'critica',
        status: 'em_andamento',
        endereco: 'Avenida B, 456',
        cep: '03145-000',
        cidade: 'São Paulo',
        bairro: 'Zona Leste'
      },
      {
        numero_chamado: 'HC-2024-0003',
        titulo: 'Qualidade da água',
        descricao: 'Água com cor avermelhada',
        categoria_id: 3,
        usuario_solicitante_id: usuariosMap['joao@test.com.br'],
        prioridade: 'media',
        status: 'aberto',
        endereco: 'Rua C, 789',
        cep: '02245-000',
        cidade: 'São Paulo',
        bairro: 'Vila Mariana'
      }
    ];

    for (const chamado of chamadosData) {
      await pool.query(
        `INSERT INTO chamados 
        (numero_chamado, titulo, descricao, categoria_id, usuario_solicitante_id, usuario_agente_id, prioridade, status, endereco, cep, cidade, bairro) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (numero_chamado) DO NOTHING`,
        [
          chamado.numero_chamado,
          chamado.titulo,
          chamado.descricao,
          chamado.categoria_id,
          chamado.usuario_solicitante_id,
          chamado.usuario_agente_id,
          chamado.prioridade,
          chamado.status,
          chamado.endereco,
          chamado.cep,
          chamado.cidade,
          chamado.bairro
        ]
      );
    }

    console.log('✅ Chamados de teste inseridos com sucesso');

    console.log('\n📊 Dados de acesso de teste:');
    console.log('Admin: admin@sabesp.com.br / admin123');
    console.log('Agente: carlos@sabesp.com.br / 123456');
    console.log('Solicitante: joao@test.com.br / 123456');

  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();
