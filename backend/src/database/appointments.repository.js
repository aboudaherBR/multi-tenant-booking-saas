
const pool = require('./db');

async function createAppointment({
  companyId,
  professionalId,
  serviceId,
  clientId,
  date,
  startTime,
  endTime,
  serviceNameSnapshot,
  servicePriceSnapshot,
  serviceDurationSnapshot
}) {
  const result = await pool.query(
    `
      INSERT INTO appointments (
        company_id,
        professional_id,
        service_id,
        client_id,
        date,
        start_time,
        end_time,
        service_name_snapshot,
        service_price_snapshot,
        service_duration_snapshot
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING 
        id,
        company_id,
        professional_id,
        service_id,
        client_id,
        date,
        start_time,
        end_time,
        service_name_snapshot,
        service_price_snapshot,
        service_duration_snapshot,
        created_at
    `,
    [
      companyId,
      professionalId,
      serviceId,
      clientId,
      date,
      startTime,
      endTime,
      serviceNameSnapshot,
      servicePriceSnapshot,
      serviceDurationSnapshot
    ]
  );

  return result.rows[0];
}

async function findAppointmentsByDate({ date, professionalId, companyId }) {
  const result = await pool.query(
    `
      SELECT
        id,
        company_id,
        professional_id,
        service_id,
        client_id,
        date,
        start_time,
        end_time,
        service_name_snapshot,
        service_price_snapshot,
        service_duration_snapshot,
        created_at
      FROM appointments
      WHERE company_id = $1
        AND professional_id = $2
        AND date = $3
      ORDER BY start_time ASC
    `,
    [companyId, professionalId, date]
  );

  return result.rows;
}

async function getDashboardToday({ companyId, date }) {
  const result = await pool.query(
    `
      SELECT
        id,
        company_id,
        professional_id,
        service_id,
        client_id,
        date,
        start_time,
        end_time,
        service_name_snapshot,
        service_price_snapshot,
        service_duration_snapshot,
        created_at
      FROM appointments
      WHERE company_id = $1
        AND date = $2
      ORDER BY start_time ASC
    `,
    [companyId, date]
  );

  return result.rows;
}



module.exports = {
  createAppointment,
  findAppointmentsByDate,
  getDashboardToday
};

