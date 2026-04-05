const LostFound = require('../models/LostFound');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const sendResponse = require('../utils/response');
const { getPagination } = require('../services/pagination.service');

const createLostFound = asyncHandler(async (req, res) => {
  const record = await LostFound.create({
    type: req.body.type,
    title: req.body.title,
    description: req.body.description,
    images: req.body.images || [],
    campusArea: req.body.campusArea,
    dateOfEvent: req.body.dateOfEvent,
    owner: req.user._id
  });

  return sendResponse(res, 201, 'Lost/Found report created', record);
});

const getLostFoundList = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.type) filter.type = req.query.type;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.campusArea) filter.campusArea = new RegExp(req.query.campusArea, 'i');
  if (req.query.search) filter.$text = { $search: req.query.search };

  const [items, total] = await Promise.all([
    LostFound.find(filter)
      .populate('owner', 'fullName avatarUrl')
      .populate('matchedWith', 'title type status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    LostFound.countDocuments(filter)
  ]);

  return sendResponse(res, 200, 'Lost/Found records fetched', {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

const getLostFoundById = asyncHandler(async (req, res) => {
  const record = await LostFound.findById(req.params.id)
    .populate('owner', 'fullName avatarUrl campusArea')
    .populate('matchedWith', 'title description type status owner');

  if (!record) throw new ApiError(404, 'Record not found');

  return sendResponse(res, 200, 'Lost/Found record fetched', record);
});

const updateLostFound = asyncHandler(async (req, res) => {
  const record = await LostFound.findById(req.params.id);
  if (!record) throw new ApiError(404, 'Record not found');

  const isOwner = record.owner.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You can only update your own record');
  }

  const fields = ['title', 'description', 'images', 'campusArea', 'dateOfEvent', 'status'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) record[field] = req.body[field];
  });

  await record.save();
  return sendResponse(res, 200, 'Lost/Found record updated', record);
});

const matchLostFound = asyncHandler(async (req, res) => {
  const record = await LostFound.findById(req.params.id);
  if (!record) throw new ApiError(404, 'Record not found');

  const matchedWith = await LostFound.findById(req.body.matchedWithId);
  if (!matchedWith) throw new ApiError(404, 'Matched record not found');

  const isOwner = record.owner.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'Unauthorized to update match');
  }

  record.matchedWith = matchedWith._id;
  record.matchConfidence = Number(req.body.matchConfidence ?? 0.5);
  record.status = 'matched';

  matchedWith.matchedWith = record._id;
  matchedWith.matchConfidence = record.matchConfidence;
  matchedWith.status = 'matched';

  await Promise.all([record.save(), matchedWith.save()]);

  return sendResponse(res, 200, 'Lost/Found records matched', {
    source: record,
    matched: matchedWith
  });
});

module.exports = {
  createLostFound,
  getLostFoundList,
  getLostFoundById,
  updateLostFound,
  matchLostFound
};
