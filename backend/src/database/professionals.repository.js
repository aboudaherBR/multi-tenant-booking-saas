const pool = require('./db');

async function findProfessionalById(companyId, professionalId) {
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

async function findProfessionalByUserId(companyId, userId) {
  const result = await pool.query(
    `
      SELECT id
      FROM professionals
      WHERE company_id = $1
      AND user_id = $2
      AND is_active = true
    `,
    [companyId, userId]
  );

  return result.rows[0] || null;
}

module.exports = {
  findProfessionalById,
  findProfessionalByUserId
};