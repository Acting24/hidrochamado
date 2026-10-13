import app from '../server.js';
import supertest from 'supertest';

const request = supertest(app);

describe('API de Autenticação', () => {
  describe('POST /api/auth/login', () => {
    test('Deve retornar erro para credenciais inválidas', async () => {
      const res = await request
        .post('/api/auth/login')
        .send({
          email: 'naoexiste@test.com',
          senha: 'senha123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    test('Deve validar email', async () => {
      const res = await request
        .post('/api/auth/login')
        .send({
          email: 'email-invalido',
          senha: 'senha123'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/registrar', () => {
    test('Deve validar campos obrigatórios', async () => {
      const res = await request
        .post('/api/auth/registrar')
        .send({
          nome: 'Teste',
          email: 'teste@test.com'
          // falta senha e funcao
        });

      expect(res.statusCode).toBe(400);
    });

    test('Deve validar comprimento mínimo de senha', async () => {
      const res = await request
        .post('/api/auth/registrar')
        .send({
          nome: 'Teste',
          email: 'teste@test.com',
          senha: '123',
          funcao: 'solicitante'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors[0].msg).toContain('mínimo 6 caracteres');
    });
  });
});

describe('Health Check', () => {
  test('GET /api/health deve retornar status OK', async () => {
    const res = await request.get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
  });
});
