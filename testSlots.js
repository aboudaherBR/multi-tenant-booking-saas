const {
  generateBaseSlots,
  filterSlotsByServiceDuration
} = require('./src/utils/slots.utils');

const baseSlots = generateBaseSlots({
  startTime: '08:00',
  endTime: '18:00',
  intervalMinutes: 5
});

const filteredSlots = filterSlotsByServiceDuration({
  slots: baseSlots,
  serviceDurationMinutes: 60,
  companyEndTime: '18:00'
});

console.log('Últimos 5 válidos:', filteredSlots.slice(-5));
console.log('Total válidos:', filteredSlots.length);
