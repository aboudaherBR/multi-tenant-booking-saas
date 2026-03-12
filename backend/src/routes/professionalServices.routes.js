const express = require("express");

const router = express.Router();

const {
  listServicesForProfessional,
  addServiceToProfessional,
  removeServiceFromProfessional
} = require("../controllers/professionalServices.controller");


router.get(
  "/admin/professionals/:id/services",
  listServicesForProfessional
);

router.post(
  "/admin/professionals/:id/services",
  addServiceToProfessional
);

router.delete(
  "/admin/professionals/:id/services/:serviceId",
  removeServiceFromProfessional
);

module.exports = router;