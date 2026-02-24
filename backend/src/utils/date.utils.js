function getWeekdayFromDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.getDay(); // 0 (Sunday) até 6 (Saturday)
}

module.exports = {
  getWeekdayFromDate
};