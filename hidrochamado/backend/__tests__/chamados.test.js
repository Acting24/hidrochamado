import app from '../server.js';
import supertest from 'supertest';
import { pool } from '../config/database.js';

const request = supertest(app);

describe('API de Chamados', () => {
  let token = null;
  let chamado_id = null;

  // Setup: Fazer login para obter token
  beforeAll(async () => {
    const res = await request
      .post('/api/auth/login')
      .send({
        email: 'carlos@sabesp.com.br',
        senha: '123456'
      });
    
    token = res.body?.token || null;
  });

  describe('POST /api/chamados', () => {
    test('Deve criar um novo chamado com token válido', async () => {
      const res = await request
        .post('/api/chamados')
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: 'Chamado Teste',
          descricao: 'Descrição teste',
          categoria_id: 1,
          prioridade: 'media'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('chamado');
      expect(res.body.chamado).toHaveProperty('numero_chamado');
      
      chamado_id = res.body.chamado.id;
    });

    test('Deve retornar 401 sem token', async () => {
      const res = await request
        .post('/api/chamados')
        .send({
          titulo: 'Teste',
          descricao: 'Teste',
          categoria_id: 1
        });

      expect(res.statusCode).toBe(401);
    });

    test('Deve validar campos obrigatórios', async () => {
      const res = await request
        .post('/api/chamados')
        .set('Authorization', `Bearer ${token}`)
        .send({
          // Faltam campos obrigatórios
          categoria_id: 1
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });

    test('Deve validar prioridade', async () => {
      const res = await request
        .post('/api/chamados')
        .set('Authorization', `Bearer ${token}`)
        .send({
          titulo: 'Teste',
          descricao: 'Teste',
          categoria_id: 1,
          prioridade: 'invalida'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/chamados', () => {
    test('Deve listar chamados com token válido', async () => {
      const res = await request
        .get('/api/chamados')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('chamados');
      expect(Array.isArray(res.body.chamados)).toBe(true);
    });

    test('Deve retornar 401 sem token', async () => {
      const res = await request.get('/api/chamados');
      expect(res.statusCode).toBe(401);
    });

    test('Deve filtrar por status', async () => {
      const res = await request
        .get('/api/chamados?status=aberto')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      res.body.chamados.forEach(chamado => {
        expect(chamado.status).toBe('aberto');
      });
    });

    test('Deve filtrar por prioridade', async () => {
      const res = await request
        .get('/api/chamados?prioridade=alta')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      res.body.chamados.forEach(chamado => {
        expect(chamado.prioridade).toBe('alta');
      });
    });

    test('Deve suportar paginação', async () => {
      const res = await request
        .get('/api/chamados?pagina=1&limite=5')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.chamados.length).toBeLessThanOrEqual(5);
    });
  });

  describe('GET /api/chamados/:id', () => {
    test('Deve obter detalhes de um chamado', async () => {
      if (!chamado_id) {
        console.log('Pulando teste - chamado_id não definido');
        return;
      }

      const res = await request
        .get(`/api/chamados/${chamado_id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('chamado');
      expect(res.body).toHaveProperty('atividades');
    });

    test('Deve retornar 404 para chamado inexistente', async () => {
      const res = await request
        .get('/api/chamados/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/chamados/:id', () => {
    test('Deve atualizar status do chamado', async () => {
      if (!chamado_id) {
        console.log('Pulando teste - chamado_id não definido');
        return;
      }

      const res = await request
        .put(`/api/chamados/${chamado_id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'em_andamento'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.chamado.status).toBe('em_andamento');
    });

    test('Deve validar status inválido', async () => {
      if (!chamado_id) return;

      const res = await request
        .put(`/api/chamados/${chamado_id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'status_invalido'
        });

      expect(res.statusCode).toBe(400);
    });
  });
});

describe('Relatórios', () => {
  let token = null;

  beforeAll(async () => {
    const res = await request
      .post('/api/auth/login')
      .send({
        email: 'admin@sabesp.com.br',
        senha: 'admin123'
      });
    
    token = res.body?.token || null;
  });

  describe('GET /api/relatorios/dashboard', () => {
    test('Deve retornar dados do dashboard', async () => {
      const res = await request
        .get('/api/relatorios/dashboard')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('por_status');
      expect(res.body).toHaveProperty('por_prioridade');
      expect(res.body).toHaveProperty('por_categoria');
      expect(res.body).toHaveProperty('totais');
    });
  });

  describe('GET /api/relatorios/sla', () => {
    test('Deve retornar relatório SLA', async () => {
      const res = await request
        .get('/api/relatorios/sla')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/relatorios/desempenho-agentes', () => {
    test('Deve retornar desempenho dos agentes (admin only)', async () => {
      const res = await request
        .get('/api/relatorios/desempenho-agentes')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
