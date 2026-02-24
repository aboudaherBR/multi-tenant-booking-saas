const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middlewares/auth.middleware');
const scheduleBlocksController = require('../controllers/scheduleBlocks.controller');

router.post(
  '/schedule-blocks',
  requireAuth,
  scheduleBlocksController.create
);

router.get(
  '/schedule-blocks',
  requireAuth,
  scheduleBlocksController.list
);

router.delete(
  '/schedule-blocks/:id',
  requireAuth,
  scheduleBlocksController.remove
);

router.put(
  '/schedule-blocks/:id',
  requireAuth,
  scheduleBlocksController.update
);




module.exports = router;
