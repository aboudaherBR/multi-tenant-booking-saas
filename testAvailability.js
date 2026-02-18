require('dotenv').config();

const { getAvailableSlots } = require('./src/services/availability.service');

async function test() {
  const slots = await getAvailableSlots({
    companyId: 'ada9aefb-7d88-4ecd-9e3d-8eed8781f4d8',
    professionalId: '467e5006-a500-44a0-8ace-26edb1097ac5',
    serviceDurationMinutes: 60,
    date: '2026-02-18' // MONDAY
  });

  console.log('Primeiros 10:', slots.slice(0, 10));
  console.log('Total disponíveis:', slots.length);
  console.log('Company config check...');

}

test();
