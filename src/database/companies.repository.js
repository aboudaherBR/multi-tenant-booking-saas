const { connect } = require('./db');

async function createCompany(name) {
  const pool = await connect();

  const result = await pool.query(
    `
      INSERT INTO companies (name)
      VALUES ($1)
      RETURNING id, name, status, created_at, subscription_ends_at
    `,
    [name]
  );

  return result.rows[0];
}

async function findCompanyById(companyId) {
  const pool = await connect();

  const result = await pool.query(
    `
      SELECT id, status, appointment_buffer_minutes, subscription_ends_at, slot_interval_minutes
      FROM companies
      WHERE id = $1
    `,
    [companyId]
  );

  return result.rows[0];
}

module.exports = {
  createCompany,
  findCompanyById
};
