require('dotenv').config();

const { findByCompanyAndWeekday } = require('./src/database/companyBusinessHours.repository');

async function test() {
  try {
    const businessHours = await findByCompanyAndWeekday({
      companyId: 'ada9aefb-7d88-4ecd-9e3d-8eed8781f4d8',
      weekday: 'MONDAY'
    });

    console.log('Business Hours:');
    console.log(businessHours);
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    process.exit();
  }
}

test();
