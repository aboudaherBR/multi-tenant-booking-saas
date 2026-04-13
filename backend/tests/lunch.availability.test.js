const request = require('supertest');
const app = require('../src/app');

// 🔧 helper correto
function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

describe('Availability - Lunch Time Rules', () => {
  const agent = request.agent(app);

  const professionalId = '33333333-3333-3333-3333-333333333333';
  const serviceId = '44444444-4444-4444-4444-444444444444';

  let token;

  // 🔐 Login
  beforeAll(async () => {
    const res = await agent.post('/api/login').send({
      username: 'admin',
      password: '123456'
    });

    expect(res.statusCode).toBe(200);
    token = res.body.token;
    expect(token).toBeDefined();
  });

  // -----------------------------
  // 1️⃣ Não deve existir slot dentro do almoço
  // -----------------------------
  test('Não deve retornar slots durante o horário de almoço', async () => {
    const res = await agent
      .get('/api/availability')
      .set('Authorization', `Bearer ${token}`)
      .query({
        professionalId,
        serviceId,
        date: '2026-04-09'
      });

    expect(res.statusCode).toBe(200);

    const invalidSlots = res.body.slots.filter(slot => {
      const minutes = timeToMinutes(slot);
      return minutes >= 720 && minutes < 780; // 12:00–13:00
    });

    console.log('SLOTS GERADOS:', res.body.slots);
    console.log('SLOTS DENTRO DO ALMOÇO:', invalidSlots);

    expect(invalidSlots.length).toBe(0);
  });

  // -----------------------------
  // 2️⃣ Slot que cruza o almoço não deve existir
  // -----------------------------
  test('Não deve permitir slot que cruza o horário de almoço', async () => {
    const res = await agent
      .get('/api/availability')
      .set('Authorization', `Bearer ${token}`)
      .query({
        professionalId,
        serviceId,
        date: '2026-04-09'
      });

    expect(res.statusCode).toBe(200);

    expect(res.body.slots).not.toContain('11:30');
  });

  // -----------------------------
  // 3️⃣ Deve existir slot fora do almoço
  // -----------------------------
  test('Deve retornar slots fora do horário de almoço', async () => {
    const res = await agent
      .get('/api/availability')
      .set('Authorization', `Bearer ${token}`)
      .query({
        professionalId,
        serviceId,
        date: '2026-04-09'
      });

    expect(res.statusCode).toBe(200);

    const morningSlots = res.body.slots.filter(
      slot => timeToMinutes(slot) < 720
    );

    const afternoonSlots = res.body.slots.filter(
      slot => timeToMinutes(slot) >= 780
    );

    expect(morningSlots.length).toBeGreaterThan(0);
    expect(afternoonSlots.length).toBeGreaterThan(0);
  });
});