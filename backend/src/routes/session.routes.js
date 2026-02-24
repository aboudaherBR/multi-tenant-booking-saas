const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middlewares/auth.middleware');
const { getCurrentSession } = require('../controllers/session.controller');

router.get('/auth/me', requireAuth, getCurrentSession);

module.exports = router;