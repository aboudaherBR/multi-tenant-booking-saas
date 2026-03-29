
const {
  createAppointment,
  findConflicts,
  findAppointmentsByDate,
  cancelAppointment
} = require('../database/appointments.repository');

// 🔥 CORREÇÃO AQUI
const { findProfessionalByUserId } = require('../database/professionals.repository');

const { findServiceForProfessional } = require('../database/services.repository');
const { findCompanyById } = require('../database/companies.repository');
const { findScheduleBlocksByProfessionalAndDate } = require('../database/scheduleBlocks.repository');
const { normalizeBrazilianPhone } = require('../utils/phone.utils');

const {
  findClientByPhone,
  createClient,
  updateClientName
} = require('../database/clients.repository');

function addMinutesToTime(time, minutesToAdd) {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + minutesToAdd;

  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;

  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

async function create(req, res, next) {
  try {
    const {
      professionalId,
      serviceId,
      clientName,
      clientPhone,
      date,
      startTime
    } = req.body;

    if (
      !professionalId ||
      !serviceId ||
      !clientName ||
      !clientPhone ||
      !date ||
      !startTime
    ) {
      return res.status(400).json({
        message:
          'professionalId, serviceId, clientName, clientPhone, date e startTime são obrigatórios'
      });
    }

    const companyId = req.user.companyId;

    let normalizedPhone;

    try {
      normalizedPhone = normalizeBrazilianPhone(clientPhone);
    } catch (err) {
      return res.status(400).json({
        message: 'Telefone inválido'
      });
    }

    let client = await findClientByPhone({
      companyId,
      phone: normalizedPhone
    });

    if (!client) {
      client = await createClient({
        companyId,
        name: clientName.trim(),
        phone: normalizedPhone
      });
    } else {
      const normalizedExistingName = client.name.trim().toLowerCase();
      const normalizedNewName = clientName.trim().toLowerCase();

      if (normalizedExistingName !== normalizedNewName) {
        client = await updateClientName({
          clientId: client.id,
          companyId,
          name: clientName.trim()
        });
      }
    }

    const service = await findServiceForProfessional({
      companyId,
      professionalId,
      serviceId
    });

    if (!service) {
      return res.status(404).json({
        message: 'Serviço não encontrado para este profissional'
      });
    }

    const endTime = addMinutesToTime(
      startTime,
      service.duration_minutes
    );

    const company = await findCompanyById(companyId);

    if (!company) {
      return res.status(404).json({
        message: 'Empresa não encontrada'
      });
    }

    const bufferMinutes = company.appointment_buffer_minutes;

    const conflicts = await findConflicts({
      companyId,
      professionalId,
      date,
      startTime,
      endTime,
      bufferMinutes
    });

    if (conflicts.length > 0) {
      return res.status(409).json({
        message: 'Horário em conflito com outro agendamento'
      });
    }

    const blocks =
      await findScheduleBlocksByProfessionalAndDate({
        companyId,
        professionalId,
        date
      });

    for (const block of blocks) {
      if (!block.start_time || !block.end_time) {
        return res.status(409).json({
          message: 'Horário em conflito com outro agendamento'
        });
      }

      if (
        startTime < block.end_time &&
        endTime > block.start_time
      ) {
        return res.status(409).json({
          message: 'Horário em conflito com outro agendamento'
        });
      }
    }

    const appointment = await createAppointment({
      companyId,
      professionalId,
      serviceId,
      clientId: client.id,
      date,
      startTime,
      endTime,
      serviceNameSnapshot: service.name,
      servicePriceSnapshot: service.final_price,
      serviceDurationSnapshot: service.duration_minutes
    });

    return res.status(201).json(appointment);

  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  try {
    const { date, professionalId } = req.query;

    if (!date) {
      return res.status(400).json({
        message: 'date é obrigatório'
      });
    }

    const companyId = req.user.companyId;

    const appointments =
      await findAppointmentsByDate({
        companyId,
        date,
        professionalId
      });

    return res.status(200).json(appointments);

  } catch (error) {
    next(error);
  }
}

async function cancel(req, res, next) {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    await cancelAppointment({
      id,
      companyId
    });

    return res.status(204).send();

  } catch (error) {
    next(error);
  }
}

async function getMyAppointments(req, res, next) {
  try {
    const companyId = req.user.companyId;
    const userId = req.user.userId;

    const professional = await findProfessionalByUserId({
      userId,
      companyId
    });

    if (!professional) {
      return res.status(404).json({
        message: 'Profissional não encontrado'
      });
    }

    const today = new Date().toISOString().split('T')[0];

    const appointments = await findAppointmentsByDate({
      companyId,
      date: today,
      professionalId: professional.id
    });

    const totalAmount = 0;

    return res.json({
      totalAmount,
      appointments
    });

  } catch (error) {
    console.error("🔥 ERRO REAL:", error);
    return res.status(500).json({
      message: error.message,
      stack: error.stack
    });
  }
}

module.exports = {
  create,
  list,
  cancel,
  getMyAppointments
};

