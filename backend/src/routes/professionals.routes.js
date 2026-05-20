const express = require('express');
const router = express.Router();


const { requireAuth } = require('../middlewares/auth.middleware');
const professionalsController = require('../controllers/professionals.controller');

router.get(
  '/professionals',
  requireAuth,
  professionalsController.list
);

router.get(
  "/public/:companySlug/:professionalSlug/dashboard",
  professionalsController.publicDashboard
);


router.get(
  "/public/:companySlug/:professionalSlug/report",
  professionalsController.publicReport
);


router.get(
  '/public/:companySlug/professionals',
  professionalsController.listPublic
);

router.get(
  '/public/:companySlug/professionals/:slug/services',
  professionalsController.listServicesPublic
);

router.get(
  '/professionals',
  requireAuth,
  professionalsController.list
);

router.post(
  '/professionals',
  requireAuth,
  professionalsController.create
);

router.get(
  '/professionals/:professionalId/services',
  requireAuth,
  professionalsController.listServicesAdmin
);


module.exports = router;