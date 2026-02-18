function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function generateBaseSlots({ startTime, endTime, intervalMinutes }) {
  const slots = [];

  let current = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  while (current < end) {
    slots.push(minutesToTime(current));
    current += intervalMinutes;
  }

  return slots;
}

function filterSlotsByServiceDuration({
  slots,
  serviceDurationMinutes,
  companyEndTime
}) {
  const validSlots = [];

  const companyEndMinutes = timeToMinutes(companyEndTime);

  for (const slot of slots) {
    const startMinutes = timeToMinutes(slot);
    const endMinutes = startMinutes + serviceDurationMinutes;

    if (endMinutes <= companyEndMinutes) {
      validSlots.push(slot);
    }
  }

  return validSlots;
}


module.exports = {
  generateBaseSlots,
  filterSlotsByServiceDuration
};
