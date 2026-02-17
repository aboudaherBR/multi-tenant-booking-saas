const {
  createAppointment,
  deleteAppointment,
  updateAppointment
} = require('../services/appointments.service');
const {
  getAppointmentsByProfessionalAndDate,
  saveAppointment
} = require('../database/appointments.repository');



async function create(req, res, next) {
  try {
    const { date, professionalId } = req.body;

    const existingAppointments =
      await getAppointmentsByProfessionalAndDate(professionalId, date);

    const appointment = createAppointment(
      req.body,
      existingAppointments
    );

    const savedAppointment = await saveAppointment(appointment);

    return res.status(201).json(savedAppointment);
  } catch (error) {
    next(error);
  }
}


async function list(req, res, next) {
  try {
    const { professionalId, date } = req.query;

    if (!professionalId || !date) {
      return res.status(400).json({
        error: 'professionalId e date são obrigatórios.'
      });
    }

    const appointments =
      await getAppointmentsByProfessionalAndDate(professionalId, date);

    return res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;

    await deleteAppointment(id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;

    const updatedAppointment = await updateAppointment(id, req.body);

    return res.status(200).json(updatedAppointment);
  } catch (error) {
    next(error);
  }
}






module.exports = {
  create,
  list,
  remove,
  update
};
