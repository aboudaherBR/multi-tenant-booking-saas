const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middlewares/auth.middleware');
const professionalsController = require('../controllers/professionals.controller');

router.get(
  '/professionals',
  requireAuth,
  professionalsController.list
);

module.exports = router;