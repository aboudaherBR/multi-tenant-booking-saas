const express = require('express');
const router = express.Router();

console.log("reports routes loaded");

const reportsController = require('../controllers/reports.controller');

router.get(
  '/reports/summary',
  reportsController.getSummary
);

module.exports = router;