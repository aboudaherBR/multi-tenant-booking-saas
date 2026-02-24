const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middlewares/auth.middleware');
const { create } = require('../controllers/appointments.controller');

router.post('/appointments', requireAuth, create);

module.exports = router;
