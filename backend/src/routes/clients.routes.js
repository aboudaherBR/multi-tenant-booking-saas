const express = require('express');
const router = express.Router();

const { requireAuth } =
  require('../middlewares/auth.middleware');

const clientsController =
  require('../controllers/client.controller');

// 🔒 rota protegida (admin)
router.get(
  '/clients',
  requireAuth,
  clientsController.list
);

// 🌍 rota pública (booking)
router.get(
  '/clients/by-phone/:slug',
  clientsController.getByPhone
);

// 🔍 busca clientes admin
router.get(
  '/clients/search',
  requireAuth,
  clientsController.search
);

module.exports = router;