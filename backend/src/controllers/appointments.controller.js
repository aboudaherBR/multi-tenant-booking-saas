const pool = require('../database/db');

const {
  createAppointment,
  findConflicts,
  findAppointmentsByDate
} = require('../database/appointments.repository');

const { findServiceForProfessional } = require('../database/services.repository');
const { findCompanyById } = require('../database/companies.repository');
const { findScheduleBlocksByProfessionalAndDate } = require('../database/scheduleBlocks.repository');
const { normalizeBrazilianPhone } = require('../utils/phone.utils');
const { cancelAppointment } = require('../database/appointments.repository');

const {
  findClientByPhone,
  createClient,
  updateClientName
} = require('../database/clients.repository');

const appointmentsRepository = require('../database/appointments.repository');

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

    // 🔹 1️⃣ Normalizar telefone
    let normalizedPhone;

    try {
      normalizedPhone = normalizeBrazilianPhone(clientPhone);
    } catch (err) {
      return res.status(400).json({
        message: 'Telefone inválido'
      });
    }

    // 🔹 2️⃣ Buscar ou criar cliente
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

    // 🔹 3️⃣ Buscar serviço
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

    // 🔹 4️⃣ Calcular endTime
    const endTime = addMinutesToTime(
      startTime,
      service.duration_minutes
    );

    // 🔹 5️⃣ Buscar empresa
    const company = await findCompanyById(companyId);

    if (!company) {
      return res.status(404).json({
        message: 'Empresa não encontrada'
      });
    }

    const bufferMinutes = company.appointment_buffer_minutes;

    // 🔹 6️⃣ Conflito profissional
    const conflicts = await findConflicts({
      companyId,
      professionalId,
      date,
      startTime,
      endTime,
      bufferMinutes
    });

    // 🔹 6️⃣.1 Conflito do cliente
    console.log("DEBUG CLIENT CHECK", {
      clientId: client.id,
      date,
      startTime
    });

    const clientConflict = await pool.query(
      `
      SELECT id
      FROM appointments
      WHERE company_id = $1
        AND client_id = $2
        AND date = $3
        AND start_time = $4::time
      LIMIT 1
      `,
      [companyId, client.id, date, startTime]
    );

    if (clientConflict.rows.length > 0) {
      return res.status(409).json({
        message: 'Você já possui um agendamento nesse horário'
      });
    }

    // 🔹 6️⃣.2 conflito profissional
    if (conflicts.length > 0) {
      return res.status(409).json({
        message: 'Horário em conflito com outro agendamento'
      });
    }

    // 🔹 7️⃣ schedule blocks
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

    // 🔹 8️⃣ Criar appointment
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

async function markAsNotified(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: 'Appointment ID is required'
      });
    }

    const updated = await appointmentsRepository.markAsNotified(id);

    if (!updated) {
      return res.status(404).json({
        error: 'Appointment not found'
      });
    }

    return res.json(updated);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  list,
  cancel,
  markAsNotified
};