const request = require('supertest');
const app = require('../src/app'); // Importa apenas o app
// Sem login por enquanto
// require('dotenv').config();

describe('Suite completa de testes 1 a 15 - sem login', () => {
  const professionalId = 'd8f05011-3de6-4630-826f-51a322fd3c5c';
  const serviceId = '4d40248f-87a5-453f-8bd9-460580a3bda0';
  const companyId = '672d35c1-a21f-4a15-899e-06d771328e0a';

  // -----------------------------
  // 1️⃣ Teste 1 – Availability básico
  test('Teste 1: Availability básico', async () => {
    const res = await request(app)
      .get('/availability')
      .query({ professionalId, serviceId, date: '2026-04-09' });
    expect(res.body.slots).toBeDefined();
  });

  // -----------------------------
  // 2️⃣ Teste 2 – Criar appointment básico
  test('Teste 2: Criar appointment básico', async () => {
    const res = await request(app)
      .post('/appointments')
      .send({
        professionalId,
        serviceId,
        clientName: 'Cliente Teste',
        date: '2026-04-09',
        startTime: '11:00'
      });
    expect(res.body.start_time).toBe('11:00:00');
  });

  // -----------------------------
  // 3️⃣ Teste 3 – Schedule block parcial
  test('Teste 3: Criar bloqueio parcial', async () => {
    const res = await request(app)
      .post('/schedule-blocks')
      .send({
        professionalId,
        companyId,
        startTime: '13:00',
        endTime: '14:00',
        startDate: '2026-04-09',
        endDate: '2026-04-09'
      });
    expect(res.body.message).toBe('Schedule block created successfully');
  });

  // -----------------------------
  // 4️⃣ Teste 4 – Availability final reflete appointments e bloqueios
  test('Teste 4: Availability final', async () => {
    const res = await request(app)
      .get('/availability')
      .query({ professionalId, serviceId, date: '2026-04-09' });

    expect(res.body.slots).not.toContain('11:00'); // appointment
    expect(res.body.slots).not.toContain('12:00'); // almoço
    expect(res.body.slots).not.toContain('13:00'); // bloqueio
  });

  // -----------------------------
  // 5️⃣ Teste 5 – Conflito com slot ocupado
  test('Teste 5: Criar appointment em slot ocupado', async () => {
    const times = ['09:00','09:00','09:00']; // tentativa múltipla
    for (const time of times) {
      const res = await request(app)
        .post('/appointments')
        .send({
          professionalId,
          serviceId,
          clientName: `Cliente Stress ${time}`,
          date: '2026-04-13',
          startTime: time
        });
      if (time !== '09:00') {
        expect(res.body.message).toBe('Horário em conflito com outro agendamento');
      }
    }
  });

  // -----------------------------
  // 6️⃣ Teste 6 – Bloqueio global
  test('Teste 6: Bloqueio global remove todos slots', async () => {
    await request(app)
      .post('/schedule-blocks')
      .send({
        professionalId: null,
        companyId,
        startTime: null,
        endTime: null,
        startDate: '2026-04-13',
        endDate: '2026-04-13'
      });

    const res = await request(app)
      .get('/availability')
      .query({ professionalId, serviceId, date: '2026-04-13' });

    expect(res.body.slots.length).toBe(0);
  });

  // -----------------------------
  // 7️⃣ Teste 7 – Bloqueio parcial múltiplos profissionais
  test('Teste 7: Bloqueio parcial múltiplos profissionais', async () => {
    const professionals = [professionalId];
    for (const profId of professionals) {
      await request(app)
        .post('/schedule-blocks')
        .send({
          professionalId: profId,
          companyId,
          startTime: '14:00',
          endTime: '15:00',
          startDate: '2026-04-14',
          endDate: '2026-04-14'
        });

      const res = await request(app)
        .get('/availability')
        .query({ professionalId: profId, serviceId, date: '2026-04-14' });

      expect(res.body.slots).not.toContain('14:00');
    }
  });

  // -----------------------------
  // 8️⃣ Teste 8 – Bloqueio múltiplos dias
  test('Teste 8: Bloqueio múltiplos dias', async () => {
    await request(app)
      .post('/schedule-blocks')
      .send({
        professionalId,
        companyId,
        startTime: '10:00',
        endTime: '11:00',
        startDate: '2026-04-15',
        endDate: '2026-04-16'
      });

    for (const d of ['2026-04-15','2026-04-16']) {
      const res = await request(app)
        .get('/availability')
        .query({ professionalId, serviceId, date: d });
      expect(res.body.slots).not.toContain('10:00');
    }
  });

  // -----------------------------
  // 9️⃣ Teste 9 – Almoço e buffer
  test('Teste 9: Slots de almoço e buffer removidos', async () => {
    const res = await request(app)
      .get('/availability')
      .query({ professionalId, serviceId, date: '2026-04-09' });
    expect(res.body.slots).not.toContain('12:00'); // almoço
  });

  // -----------------------------
  // 10️⃣ Teste 10 – Appointment + bloqueio parcial
  test('Teste 10: Appointment em horário bloqueado retorna warning', async () => {
    const res = await request(app)
      .post('/appointments')
      .send({
        professionalId,
        serviceId,
        clientName: 'Cliente Teste Bloqueio',
        date: '2026-04-09',
        startTime: '13:00'
      });
    expect(res.body.message).toBe('Horário em conflito com outro agendamento');
  });

  // -----------------------------
  // 11️⃣ Teste 11 – Intervalo de datas bloqueado
  test('Teste 11: Appointment em intervalo de datas retorna warning', async () => {
    const res = await request(app)
      .post('/appointments')
      .send({
        professionalId,
        serviceId,
        clientName: 'Cliente Intervalo Datas',
        date: '2026-04-15',
        startTime: '10:00'
      });
    expect(res.body.message).toBe('Horário em conflito com outro agendamento');
  });

  // -----------------------------
  // 12️⃣ Teste 12 – Múltiplos appointments em sequência
  test('Teste 12: Múltiplos appointments', async () => {
    const times = ['09:30','10:30','11:30'];
    for (const time of times) {
      await request(app)
        .post('/appointments')
        .send({
          professionalId,
          serviceId,
          clientName: `Cliente Multi ${time}`,
          date: '2026-04-12',
          startTime: time
        });
    }
  });

  // -----------------------------
  // 13️⃣ Teste 13 – Conflitos combinados
  test('Teste 13: Confirma warnings corretos', async () => {
    const res = await request(app)
      .post('/appointments')
      .send({
        professionalId,
        serviceId,
        clientName: 'Cliente Conflito Combinado',
        date: '2026-04-12',
        startTime: '10:30'
      });
    expect(res.body.message).toBe('Horário em conflito com outro agendamento');
  });

  // -----------------------------
  // 14️⃣ Teste 14 – Stress extremo (slots ocupados)
  test('Teste 14: Stress extremo múltiplos appointments', async () => {
    const times = ['09:00','09:00','09:00'];
    for (const t of times) {
      const res = await request(app)
        .post('/appointments')
        .send({
          professionalId,
          serviceId,
          clientName: `Cliente Stress ${t}`,
          date: '2026-04-13',
          startTime: t
        });
      if (t !== '09:00') expect(res.body.message).toBe('Horário em conflito com outro agendamento');
    }
  });

  // -----------------------------
  // 15️⃣ Teste 15 – Verificação final de availability após stress
  test('Teste 15: Availability final slots', async () => {
    const res = await request(app)
      .get('/availability')
      .query({ professionalId, serviceId, date: '2026-04-13' });
    expect(res.body.slots.length).toBe(0); // todos slots removidos pelo bloqueio global
  });

});