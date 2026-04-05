const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  addWishlist,
  removeWishlist
} = require('../controllers/listing.controller');
const {
  createListingValidator,
  listingIdParamValidator,
  listingQueryValidator,
  updateListingValidator
} = require('../validators/listing.validator');

const router = express.Router();

router.get('/', listingQueryValidator, validate, getListings);
router.post('/', protect, createListingValidator, validate, createListing);
router.get('/:id', listingIdParamValidator, validate, getListingById);
router.patch('/:id', protect, listingIdParamValidator, updateListingValidator, validate, updateListing);
router.delete('/:id', protect, listingIdParamValidator, validate, deleteListing);

router.post('/:id/wishlist', protect, listingIdParamValidator, validate, addWishlist);
router.delete('/:id/wishlist', protect, listingIdParamValidator, validate, removeWishlist);

module.exports = router;
