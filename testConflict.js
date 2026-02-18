require('dotenv').config();

const { findConflicts } = require('./src/database/appointments.repository');

async function test() {
  try {
    const conflicts = await findConflicts({
      companyId: 'ada9aefb-7d88-4ecd-9e3d-8eed8781f4d8',
      professionalId: '467e5006-a500-44a0-8ace-26edb1097ac5',
      date: '2026-02-22',
      startTime: '11:00',
      endTime: '12:00',
      bufferMinutes: 10
    });

    console.log('Conflitos encontrados:');
    console.log(conflicts);
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    process.exit();
  }
}

test();
