const { listServicesForProfessional } = require('../database/services.repository');
const { isValidUUID } = require('../utils/uuid.utils');

async function list(req, res, next) {
  try {

    console.log('PARAMS:', req.params);
    const { id: professionalId } = req.params;
    const companyId = req.user.companyId;

    if (!professionalId) {
      return res.status(400).json({
        message: 'professionalId é obrigatório'
      });
    }

    if (!isValidUUID(professionalId)) {
      return res.status(400).json({
        message: 'professionalId inválido'
      });
    }

    const services = await listServicesForProfessional({
      companyId,
      professionalId
    });

    return res.status(200).json({ services });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  list
};