const Listing = require('../models/Listing');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const sendResponse = require('../utils/response');
const { getPagination } = require('../services/pagination.service');
const { detectSuspiciousListing } = require('../services/fraud.service');

const createListing = asyncHandler(async (req, res) => {
  const payload = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    type: req.body.type,
    images: req.body.images || [],
    campusArea: req.body.campusArea,
    seller: req.user._id,
    rentDetails: req.body.type === 'rent' ? req.body.rentDetails || {} : undefined
  };

  const fraudMeta = detectSuspiciousListing(payload);

  const listing = await Listing.create({
    ...payload,
    fraudMeta,
    status: fraudMeta.suspicious ? 'flagged' : 'active'
  });

  return sendResponse(res, 201, 'Listing created', listing);
});

const getListings = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { status: { $in: ['active', 'sold', 'rented'] } };

  if (req.query.category) {
    filter.category = new RegExp(req.query.category, 'i');
  }

  if (req.query.type) {
    filter.type = req.query.type;
  }

  if (req.query.campusArea) {
    filter.campusArea = new RegExp(req.query.campusArea, 'i');
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  const [items, total] = await Promise.all([
    Listing.find(filter)
      .populate('seller', 'fullName avatarUrl ratingAverage ratingCount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Listing.countDocuments(filter)
  ]);

  return sendResponse(res, 200, 'Listings fetched', {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

const getListingById = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate(
    'seller',
    'fullName avatarUrl campusArea ratingAverage ratingCount'
  );

  if (!listing) throw new ApiError(404, 'Listing not found');

  return sendResponse(res, 200, 'Listing fetched', listing);
});

const updateListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new ApiError(404, 'Listing not found');

  const isOwner = listing.seller.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You can only update your own listing');
  }

  const allowed = ['title', 'description', 'price', 'category', 'campusArea', 'images', 'status', 'rentDetails'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      listing[field] = req.body[field];
    }
  });

  const fraudMeta = detectSuspiciousListing(listing);
  listing.fraudMeta = fraudMeta;

  if (fraudMeta.suspicious && listing.status === 'active') {
    listing.status = 'flagged';
  }

  await listing.save();

  return sendResponse(res, 200, 'Listing updated', listing);
});

const deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new ApiError(404, 'Listing not found');

  const isOwner = listing.seller.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You can only delete your own listing');
  }

  await listing.deleteOne();
  return sendResponse(res, 200, 'Listing deleted');
});

const addWishlist = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new ApiError(404, 'Listing not found');

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: listing._id } },
    { new: true }
  ).populate('wishlist', 'title price category type status campusArea images');

  return sendResponse(res, 200, 'Listing added to wishlist', user.wishlist);
});

const removeWishlist = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: req.params.id } },
    { new: true }
  ).populate('wishlist', 'title price category type status campusArea images');

  return sendResponse(res, 200, 'Listing removed from wishlist', user.wishlist);
});

module.exports = {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  addWishlist,
  removeWishlist
};
