const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const sendResponse = require('../utils/response');
const { getPagination } = require('../services/pagination.service');

const createBooking = asyncHandler(async (req, res) => {
  const { listingId, startDate, endDate, note } = req.body;

  const listing = await Listing.findById(listingId);
  if (!listing) throw new ApiError(404, 'Listing not found');

  if (listing.type !== 'rent') {
    throw new ApiError(400, 'Booking is only available for rent listings');
  }

  if (listing.status !== 'active') {
    throw new ApiError(400, 'Listing is not available for booking');
  }

  if (listing.seller.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot book your own listing');
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    throw new ApiError(400, 'Invalid booking dates');
  }

  const durationDays = Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));

  if (listing.rentDetails?.minDurationDays && durationDays < listing.rentDetails.minDurationDays) {
    throw new ApiError(400, 'Booking duration is shorter than minimum allowed');
  }

  if (listing.rentDetails?.maxDurationDays && durationDays > listing.rentDetails.maxDurationDays) {
    throw new ApiError(400, 'Booking duration exceeds maximum allowed');
  }

  const perDay = listing.rentDetails?.perDayPrice || listing.price;
  const totalPrice = perDay * durationDays;

  const booking = await Booking.create({
    listing: listing._id,
    renter: req.user._id,
    owner: listing.seller,
    startDate: start,
    endDate: end,
    totalPrice,
    note: note || ''
  });

  await Notification.create({
    user: listing.seller,
    type: 'booking_request',
    title: 'New booking request',
    body: `${req.user.fullName} requested to rent ${listing.title}`,
    meta: { bookingId: booking._id, listingId: listing._id }
  });

  return sendResponse(res, 201, 'Booking request created', booking);
});

const getMyBookings = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const filter = {
    $or: [{ renter: req.user._id }, { owner: req.user._id }]
  };

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const [items, total] = await Promise.all([
    Booking.find(filter)
      .populate('listing', 'title type price campusArea status')
      .populate('renter', 'fullName avatarUrl')
      .populate('owner', 'fullName avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter)
  ]);

  return sendResponse(res, 200, 'Bookings fetched', {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('listing', 'title');
  if (!booking) throw new ApiError(404, 'Booking not found');

  const { status, note } = req.body;
  const isOwner = booking.owner.toString() === req.user._id.toString();
  const isRenter = booking.renter.toString() === req.user._id.toString();

  if (!isOwner && !isRenter && req.user.role !== 'admin') {
    throw new ApiError(403, 'Unauthorized to update this booking');
  }

  if (['approved', 'rejected', 'completed'].includes(status) && !isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'Only listing owner can set this status');
  }

  if (status === 'cancelled' && !isRenter && !isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'Only participants can cancel this booking');
  }

  booking.status = status;
  if (note) booking.note = note;
  await booking.save();

  const notifyUser = isOwner ? booking.renter : booking.owner;
  await Notification.create({
    user: notifyUser,
    type: 'booking_update',
    title: 'Booking status updated',
    body: `Booking status is now ${status} for ${booking.listing.title}`,
    meta: { bookingId: booking._id }
  });

  return sendResponse(res, 200, 'Booking status updated', booking);
});

module.exports = {
  createBooking,
  getMyBookings,
  updateBookingStatus
};
