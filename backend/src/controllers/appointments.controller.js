const { createAppointment, findConflicts } = require('../database/appointments.repository');
const { findServiceById } = require('../database/services.repository');
const { findCompanyById } = require('../database/companies.repository');
const { findScheduleBlocksByProfessionalAndDate } = require('../database/scheduleBlocks.repository');

function addMinutesToTime(time, minutesToAdd) {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + minutesToAdd;

  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;

  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

async function create(req, res, next) {
  try {
    const { professionalId, serviceId, clientName, date, startTime } = req.body;

    if (!professionalId || !serviceId || !clientName || !date || !startTime) {
      return res.status(400).json({
        message: 'professionalId, serviceId, clientName, date e startTime são obrigatórios'
      });
    }

    const companyId = req.user.companyId;

    // 1️⃣ Buscar serviço
    const service = await findServiceById({
      companyId,
      serviceId
    });

    if (!service) {
      return res.status(404).json({
        message: 'Serviço não encontrado'
      });
    }

    // 2️⃣ Calcular endTime
    const endTime = addMinutesToTime(startTime, service.duration_minutes);

    // 3️⃣ Buscar empresa (pegar buffer)
    const company = await findCompanyById(companyId);

    if (!company) {
      return res.status(404).json({
        message: 'Empresa não encontrada'
      });
    }

    const bufferMinutes = company.appointment_buffer_minutes;

    // 4️⃣ Verificar conflitos com appointments
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

    // 4.1️⃣ Verificar conflito com schedule blocks
    const blocks = await findScheduleBlocksByProfessionalAndDate({
      companyId,
      professionalId,
      date
    });

    for (const block of blocks) {
      // Bloqueio global (dia inteiro)
      if (!block.start_time || !block.end_time) {
        return res.status(409).json({
          message: 'Horário em conflito com outro agendamento'
        });
      }

      // Bloqueio parcial
      if (startTime < block.end_time && endTime > block.start_time) {
        return res.status(409).json({
          message: 'Horário em conflito com outro agendamento'
        });
      }
    }

    // 5️⃣ Criar appointment
    const appointment = await createAppointment({
      companyId,
      professionalId,
      serviceId,
      clientName,
      date,
      startTime,
      endTime,
      serviceNameSnapshot: service.name,
      servicePriceSnapshot: service.price,
      serviceDurationSnapshot: service.duration_minutes
    });

    return res.status(201).json(appointment);

  } catch (error) {
    next(error);
  }
}

module.exports = {
  create
};