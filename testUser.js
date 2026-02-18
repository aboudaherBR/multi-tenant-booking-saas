require('dotenv').config();

const { findByUsername } = require('./src/database/users.repository');

async function test() {
  try {
    const user = await findByUsername('admin_alpha');
    console.log(user);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

test();
