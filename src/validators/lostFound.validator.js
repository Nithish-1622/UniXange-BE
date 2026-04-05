const { body, param, query } = require('express-validator');

const createLostFoundValidator = [
  body('type').isIn(['lost', 'found']),
  body('title').trim().isLength({ min: 3, max: 120 }),
  body('description').trim().isLength({ min: 10, max: 2000 }),
  body('campusArea').trim().isLength({ min: 2, max: 80 }),
  body('dateOfEvent').isISO8601(),
  body('images').optional().isArray({ max: 6 }),
  body('images.*').optional().isURL()
];

const lostFoundIdValidator = [
  param('id').isMongoId()
];

const updateLostFoundValidator = [
  body('status').optional().isIn(['open', 'matched', 'closed']),
  body('title').optional().trim().isLength({ min: 3, max: 120 }),
  body('description').optional().trim().isLength({ min: 10, max: 2000 })
];

const lostFoundQueryValidator = [
  query('type').optional().isIn(['lost', 'found']),
  query('status').optional().isIn(['open', 'matched', 'closed', 'flagged']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
];

const matchLostFoundValidator = [
  param('id').isMongoId(),
  body('matchedWithId').isMongoId(),
  body('matchConfidence').optional().isFloat({ min: 0, max: 1 })
];

module.exports = {
  createLostFoundValidator,
  lostFoundIdValidator,
  updateLostFoundValidator,
  lostFoundQueryValidator,
  matchLostFoundValidator
};
