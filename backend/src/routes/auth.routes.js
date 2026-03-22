const express = require('express');
const router = express.Router();

const { login } = require('../controllers/auth.controller');

router.get('/me', (req, res) => {
  console.log("ME USER:", req.session.user);
  res.json(req.session.user || null);
});

module.exports = router;
