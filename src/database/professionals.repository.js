const { connect } = require('./db');

async function findProfessionalById(companyId, professionalId) {
  const pool = await connect();

  const result = await pool.query(
    `
      SELECT id
      FROM professionals
      WHERE company_id = $1
      AND id = $2
      AND is_active = true
    `,
    [companyId, professionalId]
  );

  return result.rows[0] || null;
}

module.exports = {
  findProfessionalById
};
