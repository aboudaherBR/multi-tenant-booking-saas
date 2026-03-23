const express = require('express');
const router = express.Router();
const { requireAuth } = require("../middlewares/auth.middleware");
const { getSummary } = require("../controllers/reports.controller");

console.log("reports routes loaded");

const reportsController = require('../controllers/reports.controller');

router.get(
  "/reports/summary",
  requireAuth,
  getSummary
);

module.exports = router;