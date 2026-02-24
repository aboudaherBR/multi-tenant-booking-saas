const request = require('supertest');
const app = require('../src/app');

describe('Suite completa 1 a 15 - Autenticada', () => {
  const agent = request.agent(app);

  const professionalId = 'd8f05011-3de6-4630-826f-51a322fd3c5c';
  const serviceId = '4d40248f-87a5-453f-8bd9-460580a3bda0';
  const companyId = '672d35c1-a21f-4a15-899e-06d771328e0a';

  // 🔐 LOGIN
  beforeAll(async () => {
    const res = await agent.post('/login').send({
      username: 'admin',
      password: '123456'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Login successful');
  });

  // -----------------------------
  // 1️⃣ Availability básico
  // -----------------------------
  test('1️⃣ Availability básico', async () => {
    const res = await agent
      .get('/availability')
      .query({ professionalId, serviceId, date: '2026-04-09' });

    expect(res.statusCode).toBe(200);
    expect(res.body.slots).toBeDefined();
    expect(Array.isArray(res.body.slots)).toBe(true);
  });

  // -----------------------------
  // 2️⃣ Criar appointment básico
  // -----------------------------
  test('2️⃣ Criar appointment básico', async () => {
    const res = await agent.post('/appointments').send({
      professionalId,
      serviceId,
      clientName: 'Cliente Teste',
      date: '2026-04-09',
      startTime: '11:00'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.start_time).toBe('11:00:00');
  });

  // -----------------------------
  // 3️⃣ Criar bloqueio parcial
  // -----------------------------
  test('3️⃣ Criar bloqueio parcial', async () => {
    const res = await agent.post('/schedule-blocks').send({
      professionalId,
      companyId,
      startTime: '13:00',
      endTime: '14:00',
      startDate: '2026-04-09',
      endDate: '2026-04-09'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Schedule block created successfully');
  });

  // -----------------------------
  // 4️⃣ Availability final
  // -----------------------------
  test('4️⃣ Availability final', async () => {
    const res = await agent
      .get('/availability')
      .query({ professionalId, serviceId, date: '2026-04-09' });

    expect(res.statusCode).toBe(200);
    expect(res.body.slots).not.toContain('11:00');
    expect(res.body.slots).not.toContain('13:00');
  });

  // -----------------------------
  // 5️⃣ Conflito slot ocupado
  // -----------------------------
  test('5️⃣ Conflito slot ocupado', async () => {
    const res = await agent.post('/appointments').send({
      professionalId,
      serviceId,
      clientName: 'Cliente Conflito',
      date: '2026-04-09',
      startTime: '11:00'
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('Horário em conflito com outro agendamento');
  });

  // -----------------------------
  // 6️⃣ Bloqueio global
  // -----------------------------
  test('6️⃣ Bloqueio global remove todos slots', async () => {
    await agent.post('/schedule-blocks').send({
      professionalId: null,
      companyId,
      startTime: null,
      endTime: null,
      startDate: '2026-04-13',
      endDate: '2026-04-13'
    });

    const res = await agent
      .get('/availability')
      .query({ professionalId, serviceId, date: '2026-04-13' });

    expect(res.statusCode).toBe(200);
    expect(res.body.slots.length).toBe(0);
  });

  // -----------------------------
  // 7️⃣ Bloqueio múltiplos dias
  // -----------------------------
  test('7️⃣ Bloqueio múltiplos dias', async () => {
    await agent.post('/schedule-blocks').send({
      professionalId,
      companyId,
      startTime: '10:00',
      endTime: '11:00',
      startDate: '2026-04-15',
      endDate: '2026-04-16'
    });

    for (const d of ['2026-04-15', '2026-04-16']) {
      const res = await agent
        .get('/availability')
        .query({ professionalId, serviceId, date: d });

      expect(res.statusCode).toBe(200);
      expect(res.body.slots).not.toContain('10:00');
    }
  });
});