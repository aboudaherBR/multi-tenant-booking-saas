const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middlewares/auth.middleware');
const controller = require('../controllers/businessHours.controller');

router.get(
  '/business-hours',
  requireAuth,
  controller.list
);

router.put(
  '/business-hours',
  requireAuth,
  controller.update
);

module.exports = router;