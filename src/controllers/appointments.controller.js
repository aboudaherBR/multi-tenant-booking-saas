const { createAppointment } = require('../services/appointments.service');

function create(req, res, next) {
  try {
    const appointment = createAppointment(
      req.body,
      req.body.existingAppointments || []
    );

    return res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create
};
