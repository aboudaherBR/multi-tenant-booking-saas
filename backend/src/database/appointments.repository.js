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

async function findAppointmentsByDate({ companyId, date, professionalId }) {

  const params = [companyId, date];
  let professionalFilter = '';

  if (professionalId) {
    params.push(professionalId);
    professionalFilter = 'AND a.professional_id = $3';
  }

  const result = await pool.query(
    `
    SELECT
      a.id,
      a.date,
      a.start_time,
      a.end_time,
      c.name AS client_name,
      s.name AS service_name,
      u.name AS professional_name
    FROM appointments a
    JOIN clients c
      ON c.id = a.client_id
     AND c.company_id = a.company_id
    JOIN services s
      ON s.id = a.service_id
     AND s.company_id = a.company_id
    JOIN professionals p
      ON p.id = a.professional_id
     AND p.company_id = a.company_id
    JOIN users u
      ON u.id = p.user_id
     AND u.company_id = p.company_id
    WHERE
      a.company_id = $1
      AND a.date = $2
      ${professionalFilter}
    ORDER BY a.start_time ASC
    `,
    params
  );

  return result.rows;
}

async function getDashboardToday({ companyId, date }) {

  const result = await pool.query(
    `
    SELECT
      COUNT(*)::int AS total_appointments,
      COALESCE(SUM(service_price_snapshot), 0)::numeric AS total_revenue
    FROM appointments
    WHERE company_id = $1
    AND date = $2
    `,
    [companyId, date]
  );

  const services = await pool.query(
    `
    SELECT
      service_name_snapshot AS name,
      COUNT(*)::int AS count
    FROM appointments
    WHERE company_id = $1
    AND date = $2
    GROUP BY service_name_snapshot
    ORDER BY count DESC
    `,
    [companyId, date]
  );

  return {
    totalAppointments: result.rows[0].total_appointments,
    totalRevenue: result.rows[0].total_revenue,
    services: services.rows
  };
}

async function cancelAppointment({ id, companyId }) {

  await pool.query(
    `
    DELETE FROM appointments
    WHERE id = $1
      AND company_id = $2
    `,
    [id, companyId]
  );

}

async function findProfessionalByUserId({ userId, companyId }) {
  const result = await pool.query(
    `
    SELECT id
    FROM professionals
    WHERE user_id = $1
      AND company_id = $2
    `,
    [userId, companyId]
  );

  return result.rows[0];
}

module.exports = {
  createAppointment,
  findConflicts,
  findAppointmentsByProfessionalAndDate,
  findAppointmentsInRange,
  findAppointmentsByDate,
  getDashboardToday,
  cancelAppointment,
  findProfessionalByUserId
};