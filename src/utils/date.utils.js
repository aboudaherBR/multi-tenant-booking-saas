function getWeekdayFromDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');

  const weekdays = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY'
  ];

  return weekdays[date.getDay()];
}

module.exports = {
  getWeekdayFromDate
};
