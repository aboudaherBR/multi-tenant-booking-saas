const { connect } = require('./db');

async function findServiceById({
  companyId,
  professionalId,
  serviceId
}) {
  const pool = await connect();

  const result = await pool.query(
    `
      SELECT id, name, duration_minutes, price
      FROM services
      WHERE company_id = $1
        AND professional_id = $2
        AND id = $3
        AND is_active = true
    `,
    [companyId, professionalId, serviceId]
  );

  return result.rows[0];
}

module.exports = {
  findServiceById
};
