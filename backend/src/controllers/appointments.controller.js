const { createAppointment, findConflicts } = require('../database/appointments.repository');
const { findServiceById } = require('../database/services.repository');
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

    // 🔹 1️⃣ Normalizar telefone
    let normalizedPhone;

    try {
      normalizedPhone = normalizeBrazilianPhone(clientPhone);
    } catch (err) {
      return res.status(400).json({
        message: 'Telefone inválido'
      });
    }

    // 🔹 2️⃣ Buscar cliente por telefone
    let client = await findClientByPhone({
      companyId,
      phone: normalizedPhone
    });

    if (!client) {
      // 🔹 3️⃣ Criar cliente se não existir
      client = await createClient({
        companyId,
        name: clientName.trim(),
        phone: normalizedPhone
      });
    } else {
      // 🔹 4️⃣ Atualizar nome se diferente
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

    // 🔹 5️⃣ Buscar serviço
    const service = await findServiceById({
      companyId,
      serviceId
    });

    if (!service) {
      return res.status(404).json({
        message: 'Serviço não encontrado'
      });
    }

    // 🔹 6️⃣ Calcular endTime
    const endTime = addMinutesToTime(
      startTime,
      service.duration_minutes
    );

    // 🔹 7️⃣ Buscar empresa (buffer)
    const company = await findCompanyById(companyId);

    if (!company) {
      return res.status(404).json({
        message: 'Empresa não encontrada'
      });
    }

    const bufferMinutes = company.appointment_buffer_minutes;

    // 🔹 8️⃣ Verificar conflitos com appointments
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

    // 🔹 9️⃣ Verificar conflito com schedule blocks
    const blocks =
      await findScheduleBlocksByProfessionalAndDate({
        companyId,
        professionalId,
        date
      });

    for (const block of blocks) {
      if (!block.start_time || !block.end_time) {
        return res.status(409).json({
          message:
            'Horário em conflito com outro agendamento'
        });
      }

      if (
        startTime < block.end_time &&
        endTime > block.start_time
      ) {
        return res.status(409).json({
          message:
            'Horário em conflito com outro agendamento'
        });
      }
    }

    // 🔹 🔟 Criar appointment com clientId
    const appointment = await createAppointment({
      companyId,
      professionalId,
      serviceId,
      clientId: client.id,
      date,
      startTime,
      endTime,
      serviceNameSnapshot: service.name,
      servicePriceSnapshot: service.price,
      serviceDurationSnapshot:
        service.duration_minutes
    });

    return res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create
};