const request = require('supertest');
const app = require('../src/app');

describe('Schedule Blocks - Testes Matemáticos de Sobreposição', () => {
  const agent = request.agent(app);

  const professionalId = '33333333-3333-3333-3333-333333333333';

  beforeAll(async () => {
    const res = await agent.post('/login').send({
      username: 'admin',
      password: '123456'
    });

    expect(res.statusCode).toBe(200);
  });

  test('1️⃣ Criar bloco base 10:00–12:00', async () => {
    const res = await agent.post('/schedule-blocks').send({
      professionalId,
      startDate: '2026-05-01',
      endDate: '2026-05-01',
      startTime: '10:00',
      endTime: '12:00'
    });

    expect(res.statusCode).toBe(201);
  });

  test('2️⃣ Sobreposição parcial início (09:00–11:00) deve falhar', async () => {
    const res = await agent.post('/schedule-blocks').send({
      professionalId,
      startDate: '2026-05-01',
      endDate: '2026-05-01',
      startTime: '09:00',
      endTime: '11:00'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Schedule block conflicts with existing block');
  });

  test('3️⃣ Sobreposição parcial final (11:00–13:00) deve falhar', async () => {
    const res = await agent.post('/schedule-blocks').send({
      professionalId,
      startDate: '2026-05-01',
      endDate: '2026-05-01',
      startTime: '11:00',
      endTime: '13:00'
    });

    expect(res.statusCode).toBe(400);
  });

  test('4️⃣ Sobreposição total (09:00–13:00) deve falhar', async () => {
    const res = await agent.post('/schedule-blocks').send({
      professionalId,
      startDate: '2026-05-01',
      endDate: '2026-05-01',
      startTime: '09:00',
      endTime: '13:00'
    });

    expect(res.statusCode).toBe(400);
  });

  test('5️⃣ Intervalo separado (13:00–15:00) deve funcionar', async () => {
    const res = await agent.post('/schedule-blocks').send({
      professionalId,
      startDate: '2026-05-01',
      endDate: '2026-05-01',
      startTime: '13:00',
      endTime: '15:00'
    });

    expect(res.statusCode).toBe(201);
  });

  test('6️⃣ Dia inteiro sobreposto deve falhar', async () => {
    const res = await agent.post('/schedule-blocks').send({
      professionalId,
      startDate: '2026-05-01',
      endDate: '2026-05-01'
    });

    expect(res.statusCode).toBe(400);
  });

  test('7️⃣ Mesma data diferente dia não deve conflitar', async () => {
    const res = await agent.post('/schedule-blocks').send({
      professionalId,
      startDate: '2026-05-02',
      endDate: '2026-05-02',
      startTime: '10:00',
      endTime: '12:00'
    });

    expect(res.statusCode).toBe(201);
  });
});