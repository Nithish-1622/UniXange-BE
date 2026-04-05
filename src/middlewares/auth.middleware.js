const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../services/token.service');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    throw new ApiError(401, 'Authentication token missing');
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.userId).select('-password');

  if (!user) {
    throw new ApiError(401, 'Invalid authentication token');
  }

  if (!user.isEmailVerified) {
    throw new ApiError(403, 'Email verification required');
  }

  req.user = user;
  next();
});

module.exports = { protect };
