const pool = require('./db');

async function createCompany(name) {
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
  const result = await pool.query(
    `
      SELECT 
        id, 
        status, 
        appointment_buffer_minutes, 
        subscription_ends_at, 
        slot_interval_minutes,
        lunch_start_time,
        lunch_end_time
      FROM companies
      WHERE id = $1
    `,
    [companyId]
  );

  return result.rows[0];
}

async function updateCompanyLunch(companyId, lunchStart, lunchEnd) {
  await pool.query(
    `
      UPDATE companies
      SET lunch_start_time = $2,
          lunch_end_time   = $3
      WHERE id = $1
    `,
    [companyId, lunchStart, lunchEnd]
  );
}

module.exports = {
  createCompany,
  findCompanyById,
  updateCompanyLunch
};