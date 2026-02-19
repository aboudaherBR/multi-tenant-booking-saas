const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middlewares/auth.middleware');
const companyController = require('../controllers/company.controller');

router.put(
  '/company/lunch',
  requireAuth,
  companyController.updateLunch
);

module.exports = router;
