const express = require("express");

const router = express.Router();

const { requireAuth } = require("../middlewares/auth.middleware");

const {
  listServicesForProfessional,
  addServiceToProfessional,
  removeServiceFromProfessional
} = require("../controllers/professionalServices.controller");


router.get(
  "/admin/professionals/:id/services",
  requireAuth,
  listServicesForProfessional
);

router.post(
  "/admin/professionals/:id/services",
  requireAuth,
  addServiceToProfessional
);

router.delete(
  "/admin/professionals/:id/services/:serviceId",
  requireAuth,
  removeServiceFromProfessional
);

module.exports = router;