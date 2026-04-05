const Report = require('../models/Report');
const Listing = require('../models/Listing');
const LostFound = require('../models/LostFound');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const sendResponse = require('../utils/response');
const { getPagination } = require('../services/pagination.service');

const getReports = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.targetType) filter.targetType = req.query.targetType;

  const [items, total] = await Promise.all([
    Report.find(filter)
      .populate('reporter', 'fullName email')
      .populate('reviewedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Report.countDocuments(filter)
  ]);

  return sendResponse(res, 200, 'Reports fetched', {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

const updateReportStatus = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) throw new ApiError(404, 'Report not found');

  report.status = req.body.status;
  report.resolutionNote = req.body.resolutionNote || report.resolutionNote;
  report.reviewedBy = req.user._id;

  await report.save();

  return sendResponse(res, 200, 'Report status updated', report);
});

const moderateListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new ApiError(404, 'Listing not found');

  listing.status = req.body.status;
  await listing.save();

  return sendResponse(res, 200, 'Listing moderated', listing);
});

const moderateLostFound = asyncHandler(async (req, res) => {
  const record = await LostFound.findById(req.params.id);
  if (!record) throw new ApiError(404, 'Lost/Found record not found');

  record.status = req.body.status;
  await record.save();

  return sendResponse(res, 200, 'Lost/Found record moderated', record);
});

module.exports = {
  getReports,
  updateReportStatus,
  moderateListing,
  moderateLostFound
};
