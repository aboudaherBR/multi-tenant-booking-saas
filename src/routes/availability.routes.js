const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middlewares/auth.middleware');
const availabilityController = require('../controllers/availability.controller');

router.get(
  '/availability',
  requireAuth,
  availabilityController.list
);

module.exports = router;
