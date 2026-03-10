const pool = require('./db');

async function findBusinessHoursByCompany(companyId) {

  const result = await pool.query(
    `
    SELECT
      weekday,
      start_time,
      end_time,
      is_active
    FROM company_business_hours
    WHERE company_id = $1
    ORDER BY weekday
    `,
    [companyId]
  );

  return result.rows;
}

async function upsertBusinessHours({ companyId, hours }) {

  for (const day of hours) {

    await pool.query(
      `
      INSERT INTO company_business_hours
        (company_id, weekday, start_time, end_time, is_active)
      VALUES
        ($1, $2, $3, $4, $5)
      ON CONFLICT (company_id, weekday)
      DO UPDATE SET
        start_time = EXCLUDED.start_time,
        end_time = EXCLUDED.end_time,
        is_active = EXCLUDED.is_active
      `,
      [
        companyId,
        day.weekday,
        day.start_time,
        day.end_time,
        day.is_active
      ]
    );

  }

}

module.exports = {
  findBusinessHoursByCompany,
  upsertBusinessHours
};