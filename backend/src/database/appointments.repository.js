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

async function findConflicts({
  companyId,
  professionalId,
  date,
  startTime,
  endTime,
  bufferMinutes
}) {
  const result = await pool.query(
    `
      SELECT id, start_time, end_time
      FROM appointments
      WHERE company_id = $1
        AND professional_id = $2
        AND date = $3
        AND $4::time < (end_time + (INTERVAL '1 minute' * $5))
        AND $6::time > start_time
    `,
    [
      companyId,
      professionalId,
      date,
      startTime,
      bufferMinutes,
      endTime
    ]
  );

  return result.rows;
}

async function findAppointmentsByProfessionalAndDate({
  companyId,
  professionalId,
  date
}) {
  const result = await pool.query(
    `
      SELECT id, start_time, end_time
      FROM appointments
      WHERE company_id = $1
        AND professional_id = $2
        AND date = $3
    `,
    [companyId, professionalId, date]
  );

  return result.rows;
}

async function findAppointmentsInRange({
  companyId,
  professionalId,
  startDate,
  endDate,
  startTime,
  endTime
}) {
  const safeStartTime = startTime || null;
  const safeEndTime = endTime || null;

  const result = await pool.query(
    `
      SELECT
        a.id,
        a.professional_id,
        a.client_id,
        c.name AS client_name,
        a.date,
        a.start_time,
        a.end_time,
        a.service_name_snapshot,
        a.service_price_snapshot
      FROM appointments a
      JOIN clients c
        ON c.id = a.client_id
        AND c.company_id = a.company_id
      WHERE a.company_id = $1
      AND ($2::uuid IS NULL OR a.professional_id = $2)
      AND a.date BETWEEN $3 AND $4
      AND (
        $5::time IS NULL
        OR (
          a.start_time < $6::time
          AND a.end_time > $5::time
        )
      )
      ORDER BY a.date, a.start_time
    `,
    [
      companyId,
      professionalId,
      startDate,
      endDate,
      safeStartTime,
      safeEndTime
    ]
  );

  return result.rows;
}

module.exports = {
  createAppointment,
  findConflicts,
  findAppointmentsByProfessionalAndDate,
  findAppointmentsInRange
};