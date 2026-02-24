const { updateCompanyLunch } = require('../database/companies.repository');

function isValidTimeFormat(time) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
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



module.exports = {
  updateLunch
};
