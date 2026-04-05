const express = require('express');
const { param } = require('express-validator');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  getMyNotifications,
  markNotificationRead
} = require('../controllers/notification.controller');

const router = express.Router();

router.use(protect);
router.get('/', getMyNotifications);
router.patch('/:id/read', [param('id').isMongoId()], validate, markNotificationRead);

module.exports = router;
