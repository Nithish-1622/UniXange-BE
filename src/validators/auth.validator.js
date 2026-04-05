const { body } = require('express-validator');

const signupValidator = [
  body('fullName').trim().isLength({ min: 2, max: 80 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('campusArea').optional().isString().isLength({ max: 80 })
];

const verifyOtpValidator = [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric()
];

const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
];

module.exports = {
  signupValidator,
  verifyOtpValidator,
  loginValidator
};
