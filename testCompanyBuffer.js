require('dotenv').config();

const { findCompanyById } = require('./src/database/companies.repository');

async function test() {
  try {
    const company = await findCompanyById(
      'ada9aefb-7d88-4ecd-9e3d-8eed8781f4d8'
    );

    console.log('Empresa encontrada:');
    console.log(company);
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    process.exit();
  }
}

test();
