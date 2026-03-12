const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middlewares/auth.middleware');
const { list } = require('../controllers/professionalServices.controller');

router.get(
  '/admin/professionals/:id/services',
  requireAuth,
  list
);

module.exports = router;