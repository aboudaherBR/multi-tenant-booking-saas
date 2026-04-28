const express = require('express');
const router = express.Router();

const { login } = require('../controllers/auth.controller');
router.post('/login', login);

const { signup } = require('../controllers/auth.controller');
router.post('/signup', signup);

module.exports = router;