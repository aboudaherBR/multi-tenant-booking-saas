require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),  // garante número
  user: process.env.DB_USER,
  password: (process.env.DB_PASSWORD || '').toString().trim(), // força string limpa
  database: process.env.DB_NAME
});

pool.on('connect', () => {
  console.log('Conectado ao PostgreSQL');
});

module.exports = pool;