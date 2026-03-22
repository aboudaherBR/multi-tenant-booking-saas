const express = require('express');
const router = express.Router();

const { login } = require('../controllers/auth.controller');

router.post('/login', (req, res, next) => {
  console.log("LOGIN SESSION ANTES:", req.session);
  next();
}, login);

module.exports = router;
