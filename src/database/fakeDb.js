const appointments = [];

function getAppointmentsByProfessionalAndDate(professionalId, date) {
  return appointments.filter(
    (appointment) =>
      appointment.professionalId === professionalId &&
      appointment.date === date
  );
}

function saveAppointment(appointment) {
  appointments.push(appointment);
  return appointment;
}

module.exports = {
  getAppointmentsByProfessionalAndDate,
  saveAppointment
};
