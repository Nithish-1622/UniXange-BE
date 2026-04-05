const express = require('express');
const validate = require('../middlewares/validate.middleware');
const { protect } = require('../middlewares/auth.middleware');
const {
  signup,
  verifySignupOtp,
  resendOtp,
  login,
  logout,
  me
} = require('../controllers/auth.controller');
const {
  signupValidator,
  verifyOtpValidator,
  loginValidator
} = require('../validators/auth.validator');

const router = express.Router();

router.post('/signup', signupValidator, validate, signup);
router.post('/verify-otp', verifyOtpValidator, validate, verifySignupOtp);
router.post('/resend-otp', [verifyOtpValidator[0]], validate, resendOtp);
router.post('/login', loginValidator, validate, login);
router.post('/logout', protect, logout);
router.get('/me', protect, me);

module.exports = router;
