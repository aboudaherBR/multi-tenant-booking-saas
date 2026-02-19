const { getWeekdayFromDate } = require('../utils/date.utils');
const { generateBaseSlots, filterSlotsByServiceDuration } = require('../utils/slots.utils');
const { findBusinessHoursByCompanyAndWeekday } = require('../database/companyBusinessHours.repository');
const { findCompanyById } = require('../database/companies.repository');
const { findAppointmentsByProfessionalAndDate } = require('../database/appointments.repository');
const { findScheduleBlocksByProfessionalAndDate } =
  require('../database/scheduleBlocks.repository');


function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function roundUpToNextInterval(currentMinutes, interval) {
  return Math.ceil(currentMinutes / interval) * interval;
}

async function getAvailableSlots({
  companyId,
  professionalId,
  serviceDurationMinutes,
  date
}) {

  // 1️⃣ Descobrir weekday
  const weekday = getWeekdayFromDate(date);

  // 2️⃣ Buscar horário da empresa no dia
 // 2️⃣ Buscar horário da empresa no dia
const businessHours =
  await findBusinessHoursByCompanyAndWeekday({
    companyId,
    weekday
  });

console.log("Business hours recebidos do banco:", businessHours);

if (!businessHours) {
  return [];
}


  // 3️⃣ Buscar config da empresa
  const company = await findCompanyById(companyId);
  console.log('Company:', company);


  const slotInterval = company.slot_interval_minutes;
  const bufferMinutes = company.appointment_buffer_minutes;
  const lunchStart = company.lunch_start_time;
  const lunchEnd = company.lunch_end_time;


  // 4️⃣ Gerar slots base
  const baseSlots = generateBaseSlots({
    startTime: businessHours.start_time,
    endTime: businessHours.end_time,
    intervalMinutes: slotInterval
  });

  // 5️⃣ Filtrar por duração
  const validDurationSlots = filterSlotsByServiceDuration({
    slots: baseSlots,
    serviceDurationMinutes,
    companyEndTime: businessHours.end_time
  });

  // 6️⃣ Buscar appointments existentes
  const appointments =
    await findAppointmentsByProfessionalAndDate({
      companyId,
      professionalId,
      date
    });

  const scheduleBlocks =
    await findScheduleBlocksByProfessionalAndDate({
      companyId,
      professionalId,
      date
  });


  // 7️⃣ Aplicar conflito + buffer
 // 7️⃣ Aplicar conflito + buffer + bloqueios
const availableSlots = validDurationSlots.filter(slot => {

  const slotStart = timeToMinutes(slot);
  const slotEnd = slotStart + serviceDurationMinutes;

  // 🔵 Conflito com appointments
  for (const appt of appointments) {

    const apptStart = timeToMinutes(appt.start_time);
    const apptEnd =
      timeToMinutes(appt.end_time) + bufferMinutes;

    const conflict =
      slotStart < apptEnd &&
      slotEnd > apptStart;

    if (conflict) {
      return false;
    }
  }

  // 🔴 Conflito com bloqueios
  for (const block of scheduleBlocks) {

    if (!block.start_time || !block.end_time) {
      continue;
    }

    const blockStart = timeToMinutes(block.start_time);
    const blockEnd = timeToMinutes(block.end_time);

    const conflictWithBlock =
      slotStart < blockEnd &&
      slotEnd > blockStart;

    if (conflictWithBlock) {
      return false;
    }
  }
// 🟡 Conflito com almoço
if (lunchStart && lunchEnd) {

  const lunchStartMinutes = timeToMinutes(lunchStart);
  const lunchEndMinutes = timeToMinutes(lunchEnd);

  const conflictWithLunch =
    slotStart < lunchEndMinutes &&
    slotEnd > lunchStartMinutes;

  if (conflictWithLunch) {
    return false;
  }
}

  return true;
});



 const today = new Date().toISOString().split('T')[0];
 console.log('Data testada:', new Date().toISOString().split('T')[0]);
 console.log('Data solicitada:', date);
 console.log('Hoje (Node):', today);



let finalSlots = availableSlots;

if (date === today) {

  const now = new Date();
    console.log('Horário real do Node:', now);
    console.log('Horas:', now.getHours(), 'Minutos:', now.getMinutes());
  const currentMinutes =
    now.getHours() * 60 + now.getMinutes();

  const roundedMinutes =
    roundUpToNextInterval(currentMinutes, slotInterval);

  finalSlots = availableSlots.filter(slot => {
    const slotMinutes = timeToMinutes(slot);
    return slotMinutes >= roundedMinutes;
  });
}

return finalSlots;



}

module.exports = {
  getAvailableSlots
};
