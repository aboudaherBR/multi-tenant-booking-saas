const { getWeekdayFromDate } = require('../utils/date.utils');
const { generateBaseSlots, filterSlotsByServiceDuration } = require('../utils/slots.utils');
const { findBusinessHoursByCompanyAndWeekday } = require('../database/companyBusinessHours.repository');
const { findCompanyById } = require('../database/companies.repository');
const { findAppointmentsByProfessionalAndDate } = require('../database/appointments.repository');
const { findScheduleBlocksByProfessionalAndDate } =
  require('../database/scheduleBlocks.repository');
const { getBusinessNow, getBusinessToday } = require('../utils/time.utils');

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

  console.log("AVAILABILITY SERVICE EXECUTANDO");

  // 1️⃣ Descobrir weekday
  const weekday = getWeekdayFromDate(date);

  // 2️⃣ Buscar horário da empresa no dia
  const businessHours =
    await findBusinessHoursByCompanyAndWeekday({
      companyId,
      weekday
    });

  if (!businessHours) return [];

  // 3️⃣ Buscar config da empresa
  const company = await findCompanyById(companyId);
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

  // 🔴 Se existir bloqueio de dia inteiro, não há slots disponíveis
  const hasFullDayBlock = scheduleBlocks.some(
    block => !block.start_time && !block.end_time
  );
  if (hasFullDayBlock) return [];

  // 7️⃣ Aplicar conflito + buffer + bloqueios + almoço
  const availableSlots = validDurationSlots.filter(slot => {
    const slotStart = timeToMinutes(slot);
    const slotEnd = slotStart + serviceDurationMinutes;

    // 🔵 Conflito com appointments
    for (const appt of appointments) {
      const apptStart = timeToMinutes(appt.start_time);
      const apptEnd = timeToMinutes(appt.end_time) + bufferMinutes;
      if (slotStart < apptEnd && slotEnd > apptStart) return false;
    }

    // 🔴 Conflito com bloqueios
    for (const block of scheduleBlocks) {
      if (!block.start_time || !block.end_time) continue;
      const blockStart = timeToMinutes(block.start_time);
      const blockEnd = timeToMinutes(block.end_time);
      if (slotStart < blockEnd && slotEnd > blockStart) return false;
    }

    // 🟡 Conflito com almoço (corrigido)
    if (lunchStart && lunchEnd) {
      const lunchStartMinutes = timeToMinutes(lunchStart);
      const lunchEndMinutes = timeToMinutes(lunchEnd);

      // Remover slot que inicia ou termina dentro do horário de almoço
      if (slotStart < lunchEndMinutes && slotEnd > lunchStartMinutes) return false;
    }

    return true;
  });

  // 8️⃣ Ajustar slots do dia atual
  const today = getBusinessToday();
  let finalSlots = availableSlots;

  console.log("DEBUG DATE CHECK", {
    date,
    today,
    equal: date === today
  });

  if (date === today) {
    const now = getBusinessNow();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const roundedMinutes = roundUpToNextInterval(currentMinutes, slotInterval);

    finalSlots = availableSlots.filter(slot => {
      const slotMinutes = timeToMinutes(slot);
      return slotMinutes >= roundedMinutes;
    });
  }


    // 9️⃣ Reduzir slots para agenda otimizada (estilo Booksy)
    const optimizedSlots = [];

    for (let i = 0; i < finalSlots.length; i++) {

      if (i === 0) {
        optimizedSlots.push(finalSlots[i]);
        continue;
      }

      const previous = timeToMinutes(
        optimizedSlots[optimizedSlots.length - 1]
      );

      const current = timeToMinutes(finalSlots[i]);

      if (current - previous >= serviceDurationMinutes) {
        optimizedSlots.push(finalSlots[i]);
      }

    }
    console.log("serviceDurationMinutes:", serviceDurationMinutes);
    console.log("finalSlots count:", finalSlots.length);
    console.log("optimizedSlots count:", optimizedSlots.length);
    return optimizedSlots;


  }

  module.exports = {
    getAvailableSlots
  };