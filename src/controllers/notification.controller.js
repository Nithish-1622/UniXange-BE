const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const sendResponse = require('../utils/response');
const { getPagination } = require('../services/pagination.service');

const getMyNotifications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const [items, total, unreadCount] = await Promise.all([
    Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments({ user: req.user._id }),
    Notification.countDocuments({ user: req.user._id, isRead: false })
  ]);

  return sendResponse(res, 200, 'Notifications fetched', {
    items,
    unreadCount,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) throw new ApiError(404, 'Notification not found');

  if (notification.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Unauthorized to update this notification');
  }

  notification.isRead = true;
  await notification.save();

  return sendResponse(res, 200, 'Notification marked as read', notification);
});

module.exports = {
  getMyNotifications,
  markNotificationRead
};
