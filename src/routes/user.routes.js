const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  getMe,
  updateMe,
  updateAvatar,
  getDashboard,
  getPublicUser
} = require('../controllers/user.controller');
const { updateProfileValidator, publicUserParamValidator } = require('../validators/user.validator');

const router = express.Router();

router.get('/me', protect, getMe);
router.patch('/me', protect, updateProfileValidator, validate, updateMe);
router.patch('/me/avatar', protect, updateAvatar);
router.get('/me/dashboard', protect, getDashboard);
router.get('/:id/public', publicUserParamValidator, validate, getPublicUser);

module.exports = router;
