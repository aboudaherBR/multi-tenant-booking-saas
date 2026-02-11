const express = require('express');
const router = express.Router();

const appointmentsController = require('../controllers/appointments.controller');

router.post('/appointments', appointmentsController.create);
router.get('/appointments', appointmentsController.list);
router.delete('/appointments/:id', appointmentsController.remove);


module.exports = router;
