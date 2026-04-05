const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const sendResponse = require('../utils/response');
const env = require('../config/env');
const { signToken } = require('../services/token.service');

const extractDomain = (email) => (email.split('@')[1] || '').toLowerCase();

const assertAllowedDomain = (email) => {
  const normalizedEmail = String(email || '').toLowerCase().trim();
  const requiredSuffix = env.collegeEmailSuffix || '@jainuniversity.ac.in';

  if (!normalizedEmail.endsWith(requiredSuffix)) {
    throw new ApiError(403, `Email must end with ${requiredSuffix}`);
  }

  return extractDomain(normalizedEmail);
};

const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password, campusArea } = req.body;
  const normalizedEmail = email.toLowerCase();
  const collegeDomain = assertAllowedDomain(normalizedEmail);

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  const user = await User.create({
    fullName,
    email: normalizedEmail,
    password,
    campusArea: campusArea || '',
    collegeDomain,
    isEmailVerified: true
  });

  const token = signToken({ userId: user._id, role: user.role });

  return sendResponse(res, 201, 'Signup successful', {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  assertAllowedDomain(normalizedEmail);

  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) throw new ApiError(401, 'Invalid email or password');

  const token = signToken({ userId: user._id, role: user.role });

  return sendResponse(res, 200, 'Login successful', {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl
    }
  });
});

const logout = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, 'Logout successful');
});

const me = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, 'Current user', req.user);
});

module.exports = {
  signup,
  login,
  logout,
  me
};
