require('dotenv').config();
const { Pool } = require('pg');

const isTest = process.env.NODE_ENV === 'test';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: (process.env.DB_PASSWORD || '').toString().trim(),
  database: isTest
    ? process.env.DB_NAME_TEST
    : process.env.DB_NAME
});

pool.on('connect', () => {
  console.log(
    `Conectado ao PostgreSQL (${isTest ? 'TEST' : 'DEV'})`
  );
});

module.exports = pool;