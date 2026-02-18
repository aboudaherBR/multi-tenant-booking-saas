const { connect } = require('./db');

async function findBusinessHoursByCompanyAndWeekday({ companyId, weekday }) {
  const pool = await connect();

  const result = await pool.query(
    `
      SELECT id, start_time, end_time
      FROM company_business_hours
      WHERE company_id = $1
      AND weekday = $2
      AND is_active = true
    `,
    [companyId, weekday]
  );

  return result.rows[0] || null;
}

module.exports = {
  findBusinessHoursByCompanyAndWeekday
};
