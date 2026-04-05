const { body, param } = require('express-validator');

const moderateListingValidator = [
  param('id').isMongoId(),
  body('status').isIn(['active', 'inactive', 'flagged', 'removed', 'sold', 'rented'])
];

const moderateLostFoundValidator = [
  param('id').isMongoId(),
  body('status').isIn(['open', 'matched', 'closed', 'flagged'])
];

module.exports = {
  moderateListingValidator,
  moderateLostFoundValidator
};
