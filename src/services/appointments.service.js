/**
 * Service responsável por garantir a criação de agendamentos válidos
 * de acordo com as regras do domínio.
 *
 * Este service expõe apenas o fluxo válido de criação de agendamentos.
 * As regras internas (validação de conflitos, cálculo de horário final
 * e validações de consistência) são implementadas como helpers internos
 * para evitar uso incorreto do domínio fora do contexto apropriado.
 *
 * @param {Object} data 
 * @param {string} data.date
 * @param {string} data.startTime 
 * @param {number} data.duration - Duração do agendamento (30, 45 ou 60 minutos)
 * @param {string} data.professionalId - Identificador do profissional
 * @param {Array} existingAppointments - Agendamentos existentes do profissional na mesma data
 *
 * @returns {Object} 
 *
 * @throws {Error} 
 */
function createAppointment(data, existingAppointments) {
  const { date, startTime, duration, professionalId } = data;

  validateDuration(duration);

  const endTime = calculateEndTime(startTime, duration);

  validateTimeConflict(startTime, endTime, existingAppointments);

  return {
    date,
    startTime,
    endTime,
    duration,
    professionalId
  };
}


function validateDuration(duration) {
  const allowedDurations = [30, 45, 60];

  if (!allowedDurations.includes(duration)) {
    throw new Error('Duração inválida. Valores permitidos: 30, 45 ou 60 minutos.');
  }
}

function calculateEndTime(startTime, duration) {
  const [hours, minutes] = startTime.split(':').map(Number);

  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);

  const endDate = new Date(startDate.getTime() + duration * 60000);

  const endHours = String(endDate.getHours()).padStart(2, '0');
  const endMinutes = String(endDate.getMinutes()).padStart(2, '0');

  return `${endHours}:${endMinutes}`;
}


function validateTimeConflict(startTime, endTime, existingAppointments) {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const newStart = startHours * 60 + startMinutes;
  const newEnd = endHours * 60 + endMinutes;

  for (const appointment of existingAppointments) {
    const [existingStartHours, existingStartMinutes] = appointment.startTime
      .split(':')
      .map(Number);
    const [existingEndHours, existingEndMinutes] = appointment.endTime
      .split(':')
      .map(Number);

    const existingStart = existingStartHours * 60 + existingStartMinutes;
    const existingEnd = existingEndHours * 60 + existingEndMinutes;

    const hasConflict = !(newEnd <= existingStart || newStart >= existingEnd);

    if (hasConflict) {
      throw new Error('Conflito de horário com outro agendamento existente.');
    }
  }
}



module.exports = {
  createAppointment
};
