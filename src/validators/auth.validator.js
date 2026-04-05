const { body } = require('express-validator');

const signupValidator = [
  body('fullName').trim().isLength({ min: 2, max: 80 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('campusArea').optional().isString().isLength({ max: 80 })
];

const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
];

module.exports = {
  signupValidator,
  loginValidator
};
