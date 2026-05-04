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

function roundUpToNextInterval(currentMinutes, interval) {
  return Math.ceil(currentMinutes / interval) * interval;
}

// 🔴 REGRA CENTRALIZADA (importante)
function isOverlapping(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

async function getAvailableSlots({
  companyId,
  professionalId,
  serviceDurationMinutes,
  date
}) {

  console.log("AVAILABILITY SERVICE EXECUTANDO");

  const weekday = getWeekdayFromDate(date);

  const businessHours =
    await findBusinessHoursByCompanyAndWeekday({
      companyId,
      weekday
    });

  if (!businessHours) return [];

  const company = await findCompanyById(companyId);
  const slotInterval = company.slot_interval_minutes;
  const bufferMinutes = company.appointment_buffer_minutes;
  const lunchStart = company.lunch_start_time;
  const lunchEnd = company.lunch_end_time;

  console.log("LUNCH CONFIG:", {
    lunchStart,
    lunchEnd
  });

  const baseSlots = generateBaseSlots({
    startTime: businessHours.start_time,
    endTime: businessHours.end_time,
    intervalMinutes: slotInterval
  });

  const validDurationSlots = filterSlotsByServiceDuration({
    slots: baseSlots,
    serviceDurationMinutes,
    companyEndTime: businessHours.end_time
  });

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

  // 🔍 DEBUG REAL
  console.log("BLOCK RAW:", scheduleBlocks.map(b => ({
    id: b.id,
    start_time: b.start_time,
    end_time: b.end_time,
    type_start: typeof b.start_time,
    type_end: typeof b.end_time
  })));

  const hasFullDayBlock = scheduleBlocks.some(
    block => !block.start_time && !block.end_time
  );

  if (hasFullDayBlock) return [];

  // 🔵 FILTRO PRINCIPAL
  const availableSlots = validDurationSlots.filter(slot => {
    const slotStart = timeToMinutes(slot);
    const slotEnd = slotStart + serviceDurationMinutes;

    // appointments
    for (const appt of appointments) {
      const apptStart = timeToMinutes(appt.start_time);
      const apptEnd = timeToMinutes(appt.end_time) + bufferMinutes;

      if (isOverlapping(slotStart, slotEnd, apptStart, apptEnd)) return false;
    }

    // blocks
    for (const block of scheduleBlocks) {
      if (!block.start_time || !block.end_time) continue;

      const blockStart = timeToMinutes(block.start_time);
      const blockEnd = timeToMinutes(block.end_time);

      if (isOverlapping(slotStart, slotEnd, blockStart, blockEnd)) return false;
    }

    // almoço
    if (lunchStart && lunchEnd) {
      const lunchStartMinutes = timeToMinutes(lunchStart);
      const lunchEndMinutes = timeToMinutes(lunchEnd);

      if (isOverlapping(slotStart, slotEnd, lunchStartMinutes, lunchEndMinutes)) {
        return false;
      }
    }

    return true;
  });

  const today = getBusinessToday();
  let finalSlots = availableSlots;

  console.log("DEBUG DATE CHECK", {
    date,
    today,
    equal: date === today
  });

  if (date === today) {
    const now = getBusinessNow();
    const MINIMUM_LEAD_TIME_MINUTES = 60;

    const currentMinutes =
      now.getHours() * 60 +
      now.getMinutes() +
      MINIMUM_LEAD_TIME_MINUTES;

    const roundedMinutes = roundUpToNextInterval(currentMinutes, slotInterval);

    finalSlots = availableSlots.filter(slot => {
      const slotMinutes = timeToMinutes(slot);
      return slotMinutes >= roundedMinutes;
    });
  }

  // 🔴 OTIMIZAÇÃO COM REGRA DE NEGÓCIO GARANTIDA
  const optimizedSlots = [];

  for (let i = 0; i < finalSlots.length; i++) {
    const currentSlot = finalSlots[i];
    const currentStart = timeToMinutes(currentSlot);
    const currentEnd = currentStart + serviceDurationMinutes;

    // 🔴 GARANTE que almoço nunca passa aqui
    if (lunchStart && lunchEnd) {
      const lunchStartMinutes = timeToMinutes(lunchStart);
      const lunchEndMinutes = timeToMinutes(lunchEnd);

      if (isOverlapping(currentStart, currentEnd, lunchStartMinutes, lunchEndMinutes)) {
        continue;
      }
    }

    if (optimizedSlots.length === 0) {
      optimizedSlots.push(currentSlot);
      continue;
    }

    const previous = timeToMinutes(
      optimizedSlots[optimizedSlots.length - 1]
    );

    if (currentStart - previous >= serviceDurationMinutes) {
      optimizedSlots.push(currentSlot);
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