require('dotenv').config();

const { authenticate } = require('./src/services/auth.service');

async function test() {
  try {
    const user = await authenticate('admin_alpha', '123456');
    console.log('Autenticado:', user.username);
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    process.exit();
  }
}

test();

