require('dotenv').config();
const { findBusinessHoursByCompanyAndWeekday } = require('./src/database/companyBusinessHours.repository');

async function test() {
  const result = await findBusinessHoursByCompanyAndWeekday({
    companyId: 'ada9aefb-7d88-4ecd-9e3d-8eed8781f4d8',
    weekday: 'MONDAY'
  });

  console.log(result);
}

test();
