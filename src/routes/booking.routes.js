const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createBooking,
  getMyBookings,
  updateBookingStatus
} = require('../controllers/booking.controller');
const {
  createBookingValidator,
  bookingStatusValidator
} = require('../validators/booking.validator');

const router = express.Router();

router.use(protect);
router.post('/', createBookingValidator, validate, createBooking);
router.get('/me', getMyBookings);
router.patch('/:id/status', bookingStatusValidator, validate, updateBookingStatus);

module.exports = router;
