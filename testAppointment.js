require('dotenv').config();

const { createAppointment } = require('./src/database/appointments.repository');

async function test() {
  try {
    const appointment = await createAppointment({
      companyId: 'ada9aefb-7d88-4ecd-9e3d-8eed8781f4d8',
      professionalId: '467e5006-a500-44a0-8ace-26edb1097ac5',
      clientName: 'Cliente Teste',
      date: '2026-02-20',
      startTime: '09:00',
      endTime: '10:00'
    });

    console.log('Appointment criado:');
    console.log(appointment);
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    process.exit();
  }
}

test();
