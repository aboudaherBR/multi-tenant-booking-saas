const express = require('express');
const router = express.Router();

const publicController = require('../controllers/public.controller');
const { lookupPublicAppointments } = require('../controllers/public.controller');
const { lookupClientWithAppointments } = require('../controllers/public.controller');


router.get(
  '/book/:slug/client-lookup',
  lookupClientWithAppointments
);

router.get(
  '/book/:slug/appointments',
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
  '/book/:slug',
  publicController.createPublicAppointment
);


module.exports = router;