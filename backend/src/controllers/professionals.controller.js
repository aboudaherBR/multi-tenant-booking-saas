const {
  findActiveProfessionalsByCompanyId
} = require('../database/professionals.repository');


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

module.exports = {
  list
};