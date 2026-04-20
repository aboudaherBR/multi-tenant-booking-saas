const express = require('express');
const router = express.Router();

const publicController = require('../controllers/public.controller');
const { lookupPublicAppointments } = require('../controllers/public.controller');




router.get(
  '/book/:slug/appointments/lookup',
  lookupPublicAppointments
);

router.get(
  '/agendar/:slug',
  publicController.getPublicCompany
);

router.get(
  '/agendar/:slug/profissionais',
  publicController.getPublicProfessionals
);

router.get(
  '/agendar/:slug/profissionais/:professionalSlug/servicos',
  publicController.getPublicServicesByProfessional
);

router.get(
  '/agendar/:slug/profissionais/:professionalSlug/disponibilidade',
  publicController.getPublicAvailability
);

router.post(
  '/agendar',
  publicController.createPublicAppointment
);


module.exports = router;