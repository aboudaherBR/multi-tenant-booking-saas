const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middlewares/auth.middleware');

const servicesController = require('../controllers/services.controller');

router.get(
    '/services',
    requireAuth,
    servicesController.list
);

router.post(
    '/services',
    requireAuth,
    servicesController.create
);

router.put(
    '/services/:id',
    requireAuth,
    servicesController.update
);

router.delete(
    '/services/:id',
    requireAuth,
    servicesController.remove
);

module.exports = router;