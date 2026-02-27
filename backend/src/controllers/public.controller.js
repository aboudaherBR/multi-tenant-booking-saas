const { findCompanyBySlug } = require('../database/companies.repository');
const { findActiveProfessionalsPublicByCompanyId } = require('../database/professionals.repository');
const {
  findActiveServicesPublicByProfessionalSlug,
  findServiceForProfessionalBySlugs
} = require('../database/services.repository');
const { getAvailableSlots } = require('../services/availability.service');

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

    if (!company || company.status !== 'active') {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    const professionals =
      await findActiveProfessionalsPublicByCompanyId(company.id);

    return res.status(200).json(professionals);

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

    // ✅ Validação de formato de data
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        message: 'Formato de data inválido. Use YYYY-MM-DD.'
      });
    }

    // ✅ Validação de data real (ex: 2026-99-99)
    const parsedDate = new Date(date + 'T00:00:00');
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: 'Data inválida.'
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

    // ✅ Ordenação defensiva
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

module.exports = {
  getPublicCompany,
  getPublicProfessionals,
  getPublicServicesByProfessional,
  getPublicAvailability
};