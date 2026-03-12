const { getAvailableSlots } = require('../services/availability.service');
const { findServiceById } = require('../database/services.repository');

async function list(req, res, next) {
  try {
    const { professionalId, serviceId, date } = req.query;

    if (!professionalId || !serviceId || !date) {
      return res.status(400).json({
        message: 'professionalId, serviceId e date são obrigatórios'
      });
    }

    const companyId = req.user.companyId;

    // Buscar serviço para pegar duração
    const service = await findServiceById({
      companyId,
      professionalId,
      serviceId
    });

    if (!service) {
      return res.status(404).json({
        message: 'Serviço não encontrado para este profissional'
      });
    }

    const slots = await getAvailableSlots({
      companyId,
      professionalId,
      serviceDurationMinutes: service.duration_minutes,
      date
    });
    

    return res.status(200).json({ slots });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  list
};
