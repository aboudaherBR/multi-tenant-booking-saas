const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middlewares/auth.middleware');
const { list, getByPhone } = require('../controllers/client.controller');

// 🔒 rota protegida (admin)
router.get('/clients', requireAuth, list);

// 🌍 rota pública (booking)
router.get('/clients/by-phone/:slug', getByPhone);

module.exports = router;