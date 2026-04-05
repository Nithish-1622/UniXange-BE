const { body, param } = require('express-validator');

const createReportValidator = [
  body('targetType').isIn(['user', 'listing', 'lostfound', 'chat']),
  body('targetId').isMongoId(),
  body('reason').trim().isLength({ min: 5, max: 500 })
];

const reportStatusValidator = [
  param('id').isMongoId(),
  body('status').isIn(['open', 'in_review', 'resolved', 'rejected']),
  body('resolutionNote').optional().trim().isLength({ max: 500 })
];

module.exports = {
  createReportValidator,
  reportStatusValidator
};
