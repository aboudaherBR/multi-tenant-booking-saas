const {
  updateCompanyLunch,
  updateCompanyBuffer,
  updateCompanyTheme
} = require('../database/companies.repository');


function isValidTimeFormat(time) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
}

async function updateTheme(req, res, next) {
  try {

    const { theme } = req.body;

    if (!theme) {
      return res.status(400).json({
        message: "theme é obrigatório"
      });
    }

    const company = await updateCompanyTheme(
      req.user.companyId,
      theme
    );

    return res.status(200).json(company);

  } catch (error) {
    next(error);
  }
}

async function updateLunch(req, res, next) {
  try {
    if (!req.user.isCompanyAdmin) {
      return res.status(403).json({ message: 'Only company admin can update lunch time' });
    }

    const { lunchStartTime, lunchEndTime } = req.body;

    // Permitir remover almoço
    if (!lunchStartTime && !lunchEndTime) {
      await updateCompanyLunch(req.user.companyId, null, null);
      return res.json({ message: 'Lunch removed successfully' });
    }

    if (!lunchStartTime || !lunchEndTime) {
      return res.status(400).json({
        message: 'Both lunchStartTime and lunchEndTime are required'
      });
    }

    if (!isValidTimeFormat(lunchStartTime) || !isValidTimeFormat(lunchEndTime)) {
      return res.status(400).json({
        message: 'Invalid time format. Use HH:MM'
      });
    }

    if (lunchStartTime >= lunchEndTime) {
      return res.status(400).json({
        message: 'lunchStartTime must be earlier than lunchEndTime'
      });
    }

    await updateCompanyLunch(
      req.user.companyId,
      lunchStartTime,
      lunchEndTime
    );

    return res.json({ message: 'Lunch updated successfully' });

  } catch (error) {
    next(error);
  }
}

async function updateBuffer(req, res, next) {
  try {

    const { appointmentBufferMinutes } = req.body;
    const companyId = req.user.companyId;

    if (appointmentBufferMinutes === undefined) {
      return res.status(400).json({
        message: 'appointmentBufferMinutes é obrigatório'
      });
    }

    if (appointmentBufferMinutes < 0) {
      return res.status(400).json({
        message: 'Buffer não pode ser negativo'
      });
    }

    const company = await updateCompanyBuffer({
      companyId,
      appointmentBufferMinutes
    });

    return res.status(200).json(company);

  } catch (error) {
    next(error);
  }
}

const { findCompanyById } = require("../database/companies.repository");

async function getSettings(req, res, next) {
  try {

    const companyId = req.user.companyId;

    const company = await findCompanyById(companyId);

    return res.json(company);

  } catch (error) {
    next(error);
  }
}



module.exports = {
  updateLunch,
  updateBuffer,
  getSettings,
  updateTheme
};
