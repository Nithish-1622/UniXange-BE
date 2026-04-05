const { body, param, query } = require('express-validator');

const createListingValidator = [
  body('title').trim().isLength({ min: 3, max: 120 }),
  body('description').trim().isLength({ min: 10, max: 2000 }),
  body('price').isFloat({ min: 0 }),
  body('category').trim().isLength({ min: 2, max: 60 }),
  body('type').isIn(['buy', 'sell', 'rent']),
  body('campusArea').trim().isLength({ min: 2, max: 80 }),
  body('images').optional().isArray({ max: 8 }),
  body('images.*').optional().isURL(),
  body('rentDetails').optional().isObject()
];

const listingIdParamValidator = [
  param('id').isMongoId()
];

const listingQueryValidator = [
  query('type').optional().isIn(['buy', 'sell', 'rent']),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
];

const updateListingValidator = [
  body('title').optional().trim().isLength({ min: 3, max: 120 }),
  body('description').optional().trim().isLength({ min: 10, max: 2000 }),
  body('price').optional().isFloat({ min: 0 }),
  body('category').optional().trim().isLength({ min: 2, max: 60 }),
  body('campusArea').optional().trim().isLength({ min: 2, max: 80 }),
  body('status').optional().isIn(['active', 'inactive', 'sold', 'rented'])
];

module.exports = {
  createListingValidator,
  listingIdParamValidator,
  listingQueryValidator,
  updateListingValidator
};
