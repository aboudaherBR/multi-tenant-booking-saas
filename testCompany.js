require('dotenv').config();

const { createCompany } = require('./src/database/companies.repository');

async function test() {
  try {
    const company = await createCompany('Empresa Teste Node');
    console.log(company);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

test();
