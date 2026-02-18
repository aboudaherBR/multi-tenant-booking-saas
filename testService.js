require('dotenv').config();

const { findServiceById } = require('./src/database/services.repository');

async function test() {
  try {
    const service = await findServiceById({
      companyId: 'ada9aefb-7d88-4ecd-9e3d-8eed8781f4d8',
      professionalId: '467e5006-a500-44a0-8ace-26edb1097ac5',
      serviceId: '64ab3281-0b23-4fe4-aa19-75900f5e461c'
    });

    console.log('Serviço encontrado:');
    console.log(service);
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    process.exit();
  }
}

test();
