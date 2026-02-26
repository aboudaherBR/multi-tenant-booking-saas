const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middlewares/auth.middleware');
const { list } = require('../controllers/client.controller');

router.get('/clients', requireAuth, list);

module.exports = router;