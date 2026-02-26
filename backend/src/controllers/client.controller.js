const { findActiveClientsByCompany } = require('../database/clients.repository');

async function list(req, res, next) {
  try {
    const companyId = req.user.companyId;

    const clients = await findActiveClientsByCompany(companyId);

    return res.status(200).json({ clients });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list
};