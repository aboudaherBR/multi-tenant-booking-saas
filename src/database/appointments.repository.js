const { connect } = require('./db');

async function getAppointmentsByProfessionalAndDate(professionalId, date) {
  const db = await connect();

  const appointments = await db.all(
    `
      SELECT id, date, startTime, endTime, duration, professionalId
      FROM appointments
      WHERE professionalId = ?
      AND date = ?
    `,
    [professionalId, date]
  );

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


module.exports = {
  getAppointmentsByProfessionalAndDate,
  saveAppointment,
  deleteAppointmentById
};

