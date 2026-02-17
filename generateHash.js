const bcrypt = require('bcrypt');

async function generate() {
  const password = '123456'; // senha temporária para os usuários existentes
  const saltRounds = 10;

  const hash = await bcrypt.hash(password, saltRounds);

  console.log('Hash gerado:');
  console.log(hash);
}

generate();
