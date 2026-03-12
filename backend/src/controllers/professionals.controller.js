const {
  findActiveProfessionalsByCompanyId,
  findActiveProfessionalsPublicByCompanyId
} = require('../database/professionals.repository');

const {
  findActiveServicesPublicByProfessionalSlug
} = require('../database/services.repository');

const { findCompanyBySlug } = require('../database/companies.repository');

async function list(req, res, next) {
  try {
    const companyId = req.session.user.companyId;

    const professionals =
      await findActiveProfessionalsByCompanyId(companyId);

    return res.status(200).json(professionals);

  } catch (error) {
    next(error);
  }
}

async function listPublic(req, res, next) {
  try {

    const { companySlug } = req.params;

    const company = await findCompanyBySlug(companySlug);

    if (!company) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    const companyId = company.id;

    const professionals =
      await findActiveProfessionalsPublicByCompanyId(companyId);

    return res.status(200).json(professionals);

  } catch (error) {
    next(error);
  }
}

async function listServicesPublic(req, res, next) {
  try {

    const { companySlug, slug } = req.params;

    const company = await findCompanyBySlug(companySlug);

    if (!company) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    const companyId = company.id;

    const services =
      await findActiveServicesPublicByProfessionalSlug({
        companyId,
        professionalSlug: slug
      });

    return res.status(200).json(services);

  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  listPublic,
  listServicesPublic
};