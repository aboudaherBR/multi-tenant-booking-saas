const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middlewares/auth.middleware');
const companyController = require('../controllers/company.controller');

router.get(
  "/company/settings",
  requireAuth,
  companyController.getSettings
);

router.put(
  '/company/lunch',
  requireAuth,
  companyController.updateLunch
);

router.put(
  '/company/buffer',
  requireAuth,
  companyController.updateBuffer
);

module.exports = router;
