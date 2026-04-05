const Report = require('../models/Report');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/response');

const createReport = asyncHandler(async (req, res) => {
  const report = await Report.create({
    reporter: req.user._id,
    targetType: req.body.targetType,
    targetId: req.body.targetId,
    reason: req.body.reason
  });

  return sendResponse(res, 201, 'Report submitted', report);
});

module.exports = { createReport };
