const { body, param } = require('express-validator');

const updateProfileValidator = [
  body('fullName').optional().trim().isLength({ min: 2, max: 80 }),
  body('campusArea').optional().trim().isLength({ max: 80 }),
  body('bio').optional().trim().isLength({ max: 300 })
];

const publicUserParamValidator = [
  param('id').isMongoId()
];

module.exports = {
  updateProfileValidator,
  publicUserParamValidator
};
