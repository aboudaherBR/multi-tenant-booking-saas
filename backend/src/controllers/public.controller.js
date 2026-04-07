const { findCompanyBySlug } = require('../database/companies.repository');
const { findActiveProfessionalsPublicByCompanyId } = require('../database/professionals.repository');
const {
  findActiveServicesPublicByProfessionalSlug,
  findServiceForProfessionalBySlugs
} = require('../database/services.repository');
const { getAvailableSlots } = require('../services/availability.service');
const pool = require('../database/db');
const { normalizeBrazilianPhone } = require('../utils/phone.utils');

async function getPublicCompany(req, res, next) {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        message: 'slug é obrigatório'
      });
    }

    const company = await findCompanyBySlug(slug);

    if (!company || company.status !== 'active') {
      return res.status(404).json({
        message: 'Empresa não encontrada'
      });
    }

    return res.status(200).json({
      name: company.name,
      slug: company.slug,
      slotIntervalMinutes: company.slot_interval_minutes
    });

  } catch (error) {
    next(error);
  }
}

async function getPublicProfessionals(req, res, next) {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ message: 'slug é obrigatório' });
    }

    const company = await findCompanyBySlug(slug);
    console.log("COMPANY:", company);

    if (!company || company.status !== 'active') {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    const professionals =
      await findActiveProfessionalsPublicByCompanyId(company.id);

    return res.status(200).json({ teste: 'cheguei aqui' });

  } catch (error) {
    next(error);
  }
}

async function getPublicServicesByProfessional(req, res, next) {
  try {
    const { slug: companySlug, professionalSlug } = req.params;

    if (!companySlug || !professionalSlug) {
      return res.status(400).json({
        message: 'Parâmetros inválidos'
      });
    }

    const company = await findCompanyBySlug(companySlug);

    if (!company || company.status !== 'active') {
      return res.status(404).json({
        message: 'Empresa não encontrada'
      });
    }

    const services =
      await findActiveServicesPublicByProfessionalSlug({
        companyId: company.id,
        professionalSlug
      });

    return res.status(200).json(services);

  } catch (error) {
    next(error);
  }
}

async function getPublicAvailability(req, res, next) {
  try {
    const { slug: companySlug, professionalSlug } = req.params;
    const { date, serviceSlug } = req.query;

    if (!companySlug || !professionalSlug || !date || !serviceSlug) {
      return res.status(400).json({
        message: 'Parâmetros inválidos'
      });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        message: 'Formato de data inválido. Use YYYY-MM-DD.'
      });
    }

    const parsedDate = new Date(date + 'T00:00:00');

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: 'Data inválida.'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (parsedDate < today) {
      return res.status(200).json({
        companySlug,
        professionalSlug,
        serviceSlug,
        date,
        totalSlots: 0,
        slots: []
      });
    }

    const company = await findCompanyBySlug(companySlug);

    if (!company || company.status !== 'active') {
      return res.status(404).json({
        message: 'Empresa não encontrada'
      });
    }

    const serviceData =
      await findServiceForProfessionalBySlugs({
        companyId: company.id,
        professionalSlug,
        serviceSlug
      });

    if (!serviceData) {
      return res.status(404).json({
        message: 'Serviço não encontrado para este profissional'
      });
    }

    const rawSlots = await getAvailableSlots({
      companyId: company.id,
      professionalId: serviceData.professional_id,
      serviceDurationMinutes: serviceData.duration_minutes,
      date
    });

    const slots = rawSlots.map(startTime => {
      const [h, m] = startTime.split(':').map(Number);
      const startMinutes = h * 60 + m;

      const endMinutes =
        startMinutes + serviceData.duration_minutes;

      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;

      const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

      return {
        startTime,
        endTime
      };
    });

    slots.sort((a, b) => a.startTime.localeCompare(b.startTime));

    return res.status(200).json({
      companySlug,
      professionalSlug,
      serviceSlug,
      date,
      slotIntervalMinutes: company.slot_interval_minutes,
      serviceDurationMinutes: serviceData.duration_minutes,
      totalSlots: slots.length,
      slots
    });

  } catch (error) {
    next(error);
  }
}

async function createPublicAppointment(req, res, next) {
  try {
    const {
      companySlug,
      professionalSlug,
      serviceSlug,
      date,
      startTime,
      clientName,
      phone
    } = req.body;

    if (
      !companySlug ||
      !professionalSlug ||
      !serviceSlug ||
      !date ||
      !startTime ||
      !clientName ||
      !phone
    ) {
      return res.status(400).json({
        message: "Dados obrigatórios não informados"
      });
    }

    // ✅ NORMALIZAÇÃO NO LUGAR CERTO
    let normalizedPhone;

    try {
      normalizedPhone = normalizeBrazilianPhone(phone);
    } catch (err) {
      return res.status(400).json({ message: 'Telefone inválido' });
    }

    const company = await findCompanyBySlug(companySlug);
    if (!company) {
      return res.status(404).json({
        message: "Empresa não encontrada"
      });
    }

    const serviceData = await findServiceForProfessionalBySlugs({
      companyId: company.id,
      professionalSlug,
      serviceSlug
    });

    if (
      !serviceData ||
      !serviceData.id ||
      !serviceData.professional_id ||
      !serviceData.duration_minutes ||
      !serviceData.name ||
      serviceData.price == null
    ) {
      return res.status(500).json({
        message: "Erro interno: dados do serviço incompletos"
      });
    }

    const clientResult = await pool.query(
      `
      SELECT id FROM clients
      WHERE company_id = $1 AND phone = $2
      LIMIT 1
    `,
      [company.id, normalizedPhone]
    );

    let clientId;

    if (clientResult.rows.length > 0) {
      clientId = clientResult.rows[0].id;
    } else {
      const newClient = await pool.query(
        `
        INSERT INTO clients (company_id, name, phone)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
        [company.id, clientName, normalizedPhone]
      );

      clientId = newClient.rows[0].id;
    }

    function addMinutes(time, duration) {
      const [h, m] = time.split(':').map(Number);
      const total = h * 60 + m + duration;

      const newH = Math.floor(total / 60);
      const newM = total % 60;

      return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
    }

    const endTime = addMinutes(startTime, serviceData.duration_minutes);

    await pool.query(
      `
      INSERT INTO appointments (
        company_id,
        professional_id,
        service_id,
        client_id,
        date,
        start_time,
        end_time,
        service_name_snapshot,
        service_price_snapshot,
        service_duration_snapshot
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    `,
      [
        company.id,
        serviceData.professional_id,
        serviceData.id,
        clientId,
        date,
        startTime,
        endTime,
        serviceData.name,
        serviceData.price,
        serviceData.duration_minutes
      ]
    );

    return res.status(201).json({
      message: "Agendamento criado com sucesso"
    });

  } catch (error) {

    console.error("CREATE APPOINTMENT ERROR:", error);

    if (error.code === '23P01') {
      return res.status(409).json({
        message: "Horário já ocupado"
      });
    }

    if (error.code === '23505') {
      return res.status(409).json({
        message: "Conflito de agendamento"
      });
    }

    next(error);
  }
}

module.exports = {
  getPublicCompany,
  getPublicProfessionals,
  getPublicServicesByProfessional,
  getPublicAvailability,
  createPublicAppointment
};