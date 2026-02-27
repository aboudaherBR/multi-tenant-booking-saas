const pool = require('./db');

async function findProfessionalServiceLink({ companyId, professionalId, serviceId }) {
  const result = await pool.query(
    `
      SELECT 1
      FROM professional_services
      WHERE company_id = $1
        AND professional_id = $2
        AND service_id = $3
      LIMIT 1
    `,
    [companyId, professionalId, serviceId]
  );

  return result.rows[0] || null;
}

module.exports = {
  findProfessionalServiceLink
};