const request = require('supertest');
const app = require('../src/app');

describe('Suite completa 1 a 15 - Autenticada (JWT)', () => {
  const agent = request.agent(app);

  // 🔒 IDs vindos do seed TEST
  const companyId = '11111111-1111-1111-1111-111111111111';
  const professionalId = '33333333-3333-3333-3333-333333333333';
  const serviceId = '44444444-4444-4444-4444-444444444444';

  let token;

  // 🔐 LOGIN
  beforeAll(async () => {
    const res = await agent.post('/api/login').send({
      username: 'admin',
      password: '123456'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Login successful');

    // 🔑 guarda o JWT
    token = res.body.token;
    expect(token).toBeDefined();
  });

  // -----------------------------
  // 1️⃣ Availability básico
  // -----------------------------
  test('1️⃣ Availability básico', async () => {
    const res = await agent
      .get('/api/availability')
      .set('Authorization', `Bearer ${token}`)
      .query({ professionalId, serviceId, date: '2026-04-09' });

    expect(res.statusCode).toBe(200);
    expect(res.body.slots).toBeDefined();
    expect(Array.isArray(res.body.slots)).toBe(true);
  });

  // -----------------------------
  // 2️⃣ Criar appointment básico
  // -----------------------------
  test('2️⃣ Criar appointment básico', async () => {
    const res = await agent
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        professionalId,
        serviceId,
        clientName: 'Cliente Teste',
        clientPhone: '85999999999',
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
    const res = await agent
      .post('/api/schedule-blocks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        professionalId,
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
      .get('/api/availability')
      .set('Authorization', `Bearer ${token}`)
      .query({ professionalId, serviceId, date: '2026-04-09' });

    expect(res.statusCode).toBe(200);
    expect(res.body.slots).not.toContain('11:00');
    expect(res.body.slots).not.toContain('13:00');
  });

  // -----------------------------
  // 5️⃣ Conflito slot ocupado
  // -----------------------------
  test('5️⃣ Conflito slot ocupado', async () => {
    const res = await agent
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        professionalId,
        serviceId,
        clientName: 'Cliente Conflito',
        clientPhone: '85888888888',
        date: '2026-04-09',
        startTime: '11:00'
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('Horário em conflito com outro agendamento');
  });

  // -----------------------------
  // 6️⃣ Bloqueio global remove todos slots
  // -----------------------------
  test('6️⃣ Bloqueio global remove todos slots', async () => {
    await agent
      .post('/api/schedule-blocks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        professionalId: null,
        startTime: null,
        endTime: null,
        startDate: '2026-04-13',
        endDate: '2026-04-13'
      });

    const res = await agent
      .get('/api/availability')
      .set('Authorization', `Bearer ${token}`)
      .query({ professionalId, serviceId, date: '2026-04-13' });

    expect(res.statusCode).toBe(200);
    expect(res.body.slots.length).toBe(0);
  });

  // -----------------------------
  // 7️⃣ Bloqueio múltiplos dias
  // -----------------------------
  test('7️⃣ Bloqueio múltiplos dias', async () => {
    await agent
      .post('/api/schedule-blocks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        professionalId,
        startTime: '10:00',
        endTime: '11:00',
        startDate: '2026-04-15',
        endDate: '2026-04-16'
      });

    for (const d of ['2026-04-15', '2026-04-16']) {
      const res = await agent
        .get('/api/availability')
        .set('Authorization', `Bearer ${token}`)
        .query({ professionalId, serviceId, date: d });

      expect(res.statusCode).toBe(200);
      expect(res.body.slots).not.toContain('10:00');
    }
  });
});