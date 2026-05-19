require('dotenv').config();
const { Pool } = require('pg');

const isTest = process.env.NODE_ENV === 'test';

console.log("TYPE DATABASE_URL:", typeof process.env.DATABASE_URL);
console.log("VALUE DATABASE_URL:", process.env.DATABASE_URL);

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })
  : new Pool({
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
    `Conectado ao PostgreSQL (${process.env.DATABASE_URL ? 'PROD' : isTest ? 'TEST' : 'DEV'})`
  );
});

module.exports = pool;