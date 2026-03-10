const {
  findBusinessHoursByCompany,
  upsertBusinessHours
} = require('../database/businessHours.repository');

async function list(req, res, next) {
  try {

    const companyId = req.user.companyId;

    const hours = await findBusinessHoursByCompany(companyId);

    return res.json(hours);

  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {

    const companyId = req.user.companyId;
    const { hours } = req.body;

    await upsertBusinessHours({
      companyId,
      hours
    });

    return res.status(204).send();

  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  update
};