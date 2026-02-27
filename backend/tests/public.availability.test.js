const request = require('supertest');
const app = require('../src/app');

describe('Public Availability - Validação de Data', () => {

  it('deve retornar 400 para formato de data inválido', async () => {
    const response = await request(app)
      .get('/agendar/company-test/profissionais/prof-33333333/disponibilidade')
      .query({
        date: '2026-99-99',
        serviceSlug: 'service-test'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Data inválida.');
  });

});