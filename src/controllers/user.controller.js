const User = require('../models/User');
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');
const LostFound = require('../models/LostFound');
const Chat = require('../models/Chat');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const sendResponse = require('../utils/response');

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password -otpHash -otpExpiresAt')
    .populate('wishlist', 'title price category type status campusArea images');

  return sendResponse(res, 200, 'Profile fetched', user);
});

const updateMe = asyncHandler(async (req, res) => {
  const allowed = ['fullName', 'campusArea', 'bio'];
  const updates = {};

  allowed.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  }).select('-password -otpHash -otpExpiresAt');

  return sendResponse(res, 200, 'Profile updated', user);
});

const updateAvatar = asyncHandler(async (req, res) => {
  const { avatarUrl } = req.body;

  if (!avatarUrl || typeof avatarUrl !== 'string') {
    throw new ApiError(400, 'avatarUrl is required');
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatarUrl },
    { new: true, runValidators: true }
  ).select('-password -otpHash -otpExpiresAt');

  return sendResponse(res, 200, 'Avatar updated', user);
});

const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [myListings, myBookings, lostFoundPosts, chatCount] = await Promise.all([
    Listing.countDocuments({ seller: userId }),
    Booking.countDocuments({ $or: [{ renter: userId }, { owner: userId }] }),
    LostFound.countDocuments({ owner: userId }),
    Chat.countDocuments({ participants: userId })
  ]);

  return sendResponse(res, 200, 'Dashboard summary', {
    myListings,
    myBookings,
    lostFoundPosts,
    chatCount
  });
});

const getPublicUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('fullName avatarUrl campusArea ratingAverage ratingCount createdAt');

  if (!user) throw new ApiError(404, 'User not found');

  return sendResponse(res, 200, 'Public user profile', user);
});

module.exports = {
  getMe,
  updateMe,
  updateAvatar,
  getDashboard,
  getPublicUser
};
