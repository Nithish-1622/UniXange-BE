const { body, param } = require('express-validator');

const createBookingValidator = [
  body('listingId').isMongoId(),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  body('note').optional().trim().isLength({ max: 500 })
];

const bookingStatusValidator = [
  param('id').isMongoId(),
  body('status').isIn(['approved', 'rejected', 'cancelled', 'completed']),
  body('note').optional().trim().isLength({ max: 500 })
];

module.exports = {
  createBookingValidator,
  bookingStatusValidator
};
