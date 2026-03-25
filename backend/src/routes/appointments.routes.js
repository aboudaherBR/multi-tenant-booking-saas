const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middlewares/auth.middleware');
const appointmentsController = require('../controllers/appointments.controller');

router.post(
  '/appointments',
  requireAuth,
  appointmentsController.create
);

router.get(
  '/appointments',
  requireAuth,
  appointmentsController.list
);

router.delete(
  '/appointments/:id',
  requireAuth,
  appointmentsController.cancel
);

router.post(
  '/agendar',
  publicController.createPublicAppointment
);

module.exports = router;