const {
  createScheduleBlock,
  findScheduleBlocksByCompany,
  deleteScheduleBlock,
  updateScheduleBlock,
  hasScheduleBlockConflict
} = require('../database/scheduleBlocks.repository');

const { findProfessionalById } = require('../database/professionals.repository');
const { findAppointmentsInRange } = require('../database/appointments.repository');

function isValidTimeFormat(time) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
}

function isValidDateFormat(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

async function create(req, res, next) {
  try {
    if (!req.user.isCompanyAdmin) {
      return res.status(403).json({
        message: 'Only company admin can create schedule blocks'
      });
    }

    const {
      professionalId,
      startDate,
      endDate,
      startTime,
      endTime,
      reason,
      time_scope
    } = req.body;

    let parsedStartDate = startDate;
    let parsedEndDate = endDate;
    let parsedStartTime = startTime;
    let parsedEndTime = endTime;


    if (req.body.start_datetime) {
      parsedStartDate = req.body.start_datetime.slice(0, 10);
      parsedStartTime = req.body.start_datetime.includes("T")
        ? req.body.start_datetime.slice(11, 16)
        : null;

      parsedEndDate = req.body.end_datetime
        ? req.body.end_datetime.slice(0, 10)
        : parsedStartDate;

      parsedEndTime = req.body.end_datetime && req.body.end_datetime.includes("T")
        ? req.body.end_datetime.slice(11, 16)
        : null;
    }

    console.log("DEBUG time_scope:", time_scope);

    if (!parsedStartDate || !parsedEndDate) {
      return res.status(400).json({
        message: 'startDate and endDate are required'
      });
    }

    if (!isValidDateFormat(parsedStartDate) || !isValidDateFormat(parsedEndDate)) {
      return res.status(400).json({
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    if (startDate > endDate) {
      return res.status(400).json({
        message: 'startDate cannot be after endDate'
      });
    }

    if ((startTime && !endTime) || (!startTime && endTime)) {
      return res.status(400).json({
        message: 'Both startTime and endTime must be provided together'
      });
    }

    if (startTime && endTime) {
      if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
        return res.status(400).json({
          message: 'Invalid time format. Use HH:MM'
        });
      }

      if (startTime >= endTime) {
        return res.status(400).json({
          message: 'startTime must be earlier than endTime'
        });
      }
    }

    if (professionalId) {
      const professional = await findProfessionalById(
        req.user.companyId,
        professionalId
      );

      if (!professional) {
        return res.status(404).json({
          message: 'Professional not found in this company'
        });
      }
    }

    // 🔴 Validar conflito com outros blocos
    const hasConflict = await hasScheduleBlockConflict({
      companyId: req.user.companyId,
      professionalId: professionalId || null,
      startDate,
      endDate,
      startTime: startTime || null,
      endTime: endTime || null
    });

    if (hasConflict) {
      return res.status(400).json({
        message: 'Schedule block conflicts with existing block'
      });
    }

    // 🔵 Verificar appointments existentes no período
    const existingAppointments = await findAppointmentsInRange({
      companyId: req.user.companyId,
      professionalId: professionalId || null,
      startDate,
      endDate,
      startTime: startTime || null,
      endTime: endTime || null
    });

    // 🔵 Criar bloqueio mesmo que existam appointments
    await createScheduleBlock({
      companyId: req.user.companyId,
      professionalId: professionalId || null,
      startDate,
      endDate,
      startTime: startTime || null,
      endTime: endTime || null,
      reason: reason || null
    });

    if (existingAppointments.length > 0) {
      return res.status(201).json({
        message: 'Schedule block created successfully',
        warning: `${existingAppointments.length} appointments exist during this block`,
        appointments: existingAppointments
      });
    }

    return res.status(201).json({
      message: 'Schedule block created successfully'
    });

  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  try {
    if (!req.user.isCompanyAdmin) {
      return res.status(403).json({
        message: 'Only company admin can view schedule blocks'
      });
    }

    const blocks = await findScheduleBlocksByCompany(
      req.user.companyId
    );

    return res.status(200).json({ blocks });

  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    if (!req.user.isCompanyAdmin) {
      return res.status(403).json({
        message: 'Only company admin can delete schedule blocks'
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Block id is required'
      });
    }

    const deleted = await deleteScheduleBlock(
      req.user.companyId,
      id
    );

    if (!deleted) {
      return res.status(404).json({
        message: 'Schedule block not found'
      });
    }

    return res.status(200).json({
      message: 'Schedule block deleted successfully'
    });

  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    if (!req.user.isCompanyAdmin) {
      return res.status(403).json({
        message: 'Only company admin can update schedule blocks'
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Block id is required'
      });
    }

    const {
      professionalId,
      startDate,
      endDate,
      startTime,
      endTime,
      reason
    } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: 'startDate and endDate are required'
      });
    }

    if (!isValidDateFormat(startDate) || !isValidDateFormat(endDate)) {
      return res.status(400).json({
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    if (startDate > endDate) {
      return res.status(400).json({
        message: 'startDate cannot be after endDate'
      });
    }

    if ((startTime && !endTime) || (!startTime && endTime)) {
      return res.status(400).json({
        message: 'Both startTime and endTime must be provided together'
      });
    }

    if (startTime && endTime) {
      if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
        return res.status(400).json({
          message: 'Invalid time format. Use HH:MM'
        });
      }

      if (startTime >= endTime) {
        return res.status(400).json({
          message: 'startTime must be earlier than endTime'
        });
      }
    }

    const hasConflict = await hasScheduleBlockConflict({
      companyId: req.user.companyId,
      professionalId: professionalId || null,
      startDate,
      endDate,
      startTime: startTime || null,
      endTime: endTime || null,
      ignoreBlockId: id
    });

    if (hasConflict) {
      return res.status(400).json({
        message: 'Schedule block conflicts with existing block'
      });
    }

    const updated = await updateScheduleBlock({
      companyId: req.user.companyId,
      blockId: id,
      professionalId: professionalId || null,
      startDate,
      endDate,
      startTime: startTime || null,
      endTime: endTime || null,
      reason: reason || null
    });

    if (!updated) {
      return res.status(404).json({
        message: 'Schedule block not found'
      });
    }

    return res.status(200).json({
      message: 'Schedule block updated successfully'
    });

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