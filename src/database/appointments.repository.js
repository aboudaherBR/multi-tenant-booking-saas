const { connect } = require('./db');

async function createAppointment({
  companyId,
  professionalId,
  serviceId,
  clientName,
  date,
  startTime,
  endTime,
  serviceNameSnapshot,
  servicePriceSnapshot,
  serviceDurationSnapshot
}) {
  const pool = await connect();

  const result = await pool.query(
    `
      INSERT INTO appointments (
        company_id,
        professional_id,
        service_id,
        client_name,
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
        client_name,
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
      clientName,
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
  const pool = await connect();

  console.log('findConflicts params:', {
    companyId,
    professionalId,
    date,
    startTime,
    endTime,
    bufferMinutes
  });

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
  const pool = await connect();

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




module.exports = {
  createAppointment,
  findConflicts,
  findAppointmentsByProfessionalAndDate
};
