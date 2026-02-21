require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

describe('Teste de conexão e fechamento do pool', () => {

  test('Deve conectar ao banco', async () => {
    const result = await pool.query('SELECT 1 as number');
    expect(result.rows[0].number).toBe(1);
  });

});

afterAll(async () => {
  await pool.end();
});