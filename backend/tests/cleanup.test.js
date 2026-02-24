const request = require('supertest');
const app = require('../src/app');

describe('Cleanup', () => {
  const agent = request.agent(app);

  beforeAll(async () => {
    await agent.post('/login').send({
      email: 'SEU_EMAIL_AQUI',
      password: 'SUA_SENHA_AQUI'
    });
  });

  test('Limpeza final', async () => {
    // se houver endpoint de limpeza, usar aqui
    expect(true).toBe(true);
  });
});