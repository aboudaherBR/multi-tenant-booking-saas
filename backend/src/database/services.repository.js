const pool = require('./db');

async function findServiceById({ companyId, serviceId }) {
  const result = await pool.query(
    `
      SELECT id,
             name,
             price,
             duration_minutes
      FROM services
      WHERE company_id = $1
      AND id = $2
      AND is_active = true
    `,
    [companyId, serviceId]
  );

  return result.rows[0] || null;
}

module.exports = {
  findServiceById
};