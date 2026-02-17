const { connect } = require('./db');

async function getAppointmentsByProfessionalAndDate(professionalId, date, excludeId = null) {

  const db = await connect();

  let query = `
  SELECT id, date, startTime, endTime, duration, professionalId
  FROM appointments
  WHERE professionalId = ?
  AND date = ?
`;

let params = [professionalId, date];

if (excludeId !== null) {
  query += ` AND id != ?`;
  params.push(excludeId);
}

const appointments = await db.all(query, params);


  return appointments;
}

async function saveAppointment(appointment) {
  const db = await connect();

  const result = await db.run(
    `
      INSERT INTO appointments (date, startTime, endTime, duration, professionalId)
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      appointment.date,
      appointment.startTime,
      appointment.endTime,
      appointment.duration,
      appointment.professionalId
    ]
  );

  return {
    id: result.lastID,
    ...appointment
  };
}

async function deleteAppointmentById(id) {
  const db = await connect();

  const result = await db.run(
    `
      DELETE FROM appointments
      WHERE id = ?
    `,
    [id]
  );

  return result.changes; // número de registros afetados
}

async function getAppointmentById(id) {
  const db = await connect();

  const appointment = await db.get(
    `
      SELECT id, date, startTime, endTime, duration, professionalId
      FROM appointments
      WHERE id = ?
    `,
    [id]
  );

  return appointment; // undefined se não existir
}

async function updateAppointmentById(id, appointment) {
  const db = await connect();

  await db.run(
    `
      UPDATE appointments
      SET date = ?, startTime = ?, endTime = ?, duration = ?, professionalId = ?
      WHERE id = ?
    `,
    [
      appointment.date,
      appointment.startTime,
      appointment.endTime,
      appointment.duration,
      appointment.professionalId,
      id
    ]
  );
}




module.exports = {
  getAppointmentsByProfessionalAndDate,
  saveAppointment,
  deleteAppointmentById,
  getAppointmentById,
  updateAppointmentById
};

