/**
 * Service responsável por garantir a criação de agendamentos válidos
 * de acordo com as regras do domínio.
 *
 * Este service expõe apenas o fluxo válido de criação de agendamentos.
 * As regras internas (validação de conflitos, cálculo de horário final
 * e validações de consistência) são implementadas como helpers internos
 * para evitar uso incorreto do domínio fora do contexto apropriado.
 *
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


const MINIMUM_HOURS_BEFORE_CHANGE = 4;
const {
  getAppointmentById,
  deleteAppointmentById,
  getAppointmentsByProfessionalAndDate,
  updateAppointmentById
} = require('../database/appointments.repository');


function createAppointment(data, existingAppointments) {
  const { date, startTime, duration, professionalId } = data;
  validateInput({ date, startTime, duration, professionalId });


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
    const error = new Error('Conflito de horário com outro agendamento existente.');
    error.status = 400;
    throw error;
}
  }
}

function validateInput({ date, startTime, duration, professionalId }) {
  if (!date || !startTime || duration === undefined || !professionalId) {
    throw new Error('Todos os campos são obrigatórios.');
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    throw new Error('Formato de data inválido. Use YYYY-MM-DD.');
  }

  const timeRegex = /^\d{2}:\d{2}$/;
  if (!timeRegex.test(startTime)) {
    throw new Error('Formato de horário inválido. Use HH:mm.');
  }

  const [hours, minutes] = startTime.split(':').map(Number);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Horário inválido.');
  }

  if (typeof duration !== 'number') {
    throw new Error('Duração deve ser numérica.');
  }
}

function enforceTimeWindow(date, startTime) {
  const appointmentDateTime = new Date(`${date}T${startTime}:00`);
  const now = new Date();

  const diffInMs = appointmentDateTime - now;
  const diffInHours = diffInMs / (1000 * 60 * 60);


  if (diffInHours < MINIMUM_HOURS_BEFORE_CHANGE) {
    const error = new Error(
      'Alterações só podem ser realizadas com no mínimo 4 horas de antecedência.'
    );
    error.status = 403;
    throw error;
  }
}

async function deleteAppointment(id) {
  const appointment = await getAppointmentById(id);

  if (!appointment) {
    const error = new Error('Agendamento não encontrado.');
    error.status = 404;
    throw error;
  }

  enforceTimeWindow(appointment.date, appointment.startTime);




  await deleteAppointmentById(id);
}

async function updateAppointment(id, data) {
  const appointment = await getAppointmentById(id);

  if (!appointment) {
    const error = new Error('Agendamento não encontrado.');
    error.status = 404;
    throw error;
  }

  enforceTimeWindow(appointment.date, appointment.startTime);

  const { date, startTime, duration, professionalId } = data;

  validateInput({ date, startTime, duration, professionalId });

  validateDuration(duration);

  const endTime = calculateEndTime(startTime, duration);

  const existingAppointments = await getAppointmentsByProfessionalAndDate(
  professionalId,
  date,
  id
  );

  validateTimeConflict(startTime, endTime, existingAppointments);

    await updateAppointmentById(id, {
    date,
    startTime,
    endTime,
    duration,
    professionalId
  });

  return {
    id,
    date,
    startTime,
    endTime,
    duration,
    professionalId
  };



}







module.exports = {
  createAppointment,
  deleteAppointment,
  updateAppointment
};
