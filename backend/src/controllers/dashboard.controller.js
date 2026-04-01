const { getDashboardToday } = require('../database/appointments.repository');

async function today(req, res, next) {
  try {

    console.log('REQ.USER:', req.user);

    const companyId = req.user.companyId;

    const today = new Date().toISOString().split('T')[0];

    const dashboard = await getDashboardToday({
      companyId,
      date: today
    });

    return res.status(200).json(dashboard);

  } catch (error) {
    next(error);
  }
}

module.exports = {
  today
};