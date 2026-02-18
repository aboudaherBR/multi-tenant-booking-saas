const { Pool } = require('pg');

let pool;

async function connect() {
  if (pool) {
    return pool;
  }

  pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await pool.query('SELECT 1');
    console.log('Conectado ao PostgreSQL');
  } catch (error) {
    console.error('Erro ao conectar no PostgreSQL:', error);
    process.exit(1);
  }

  return pool;
}

module.exports = {
  connect
};
