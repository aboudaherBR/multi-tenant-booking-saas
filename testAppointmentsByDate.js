require('dotenv').config();
const { findAppointmentsByProfessionalAndDate } = require('./src/database/appointments.repository');

async function test() {
  const result = await findAppointmentsByProfessionalAndDate({
    companyId: 'ada9aefb-7d88-4ecd-9e3d-8eed8781f4d8',
    professionalId: '467e5006-a500-44a0-8ace-26edb1097ac5',
    date: '2026-02-22'
  });

  console.log(result);
}

test();
