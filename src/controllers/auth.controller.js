const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const sendResponse = require('../utils/response');
const env = require('../config/env');
const { signToken } = require('../services/token.service');
const { createOtpPayload, verifyOtp } = require('../services/otp.service');
const { sendOtpEmail } = require('../services/email.service');

const extractDomain = (email) => (email.split('@')[1] || '').toLowerCase();

const assertAllowedDomain = (email) => {
  const domain = extractDomain(email);

  if (!env.collegeEmailDomains.length) {
    throw new ApiError(500, 'No college email domains configured');
  }

  if (!env.collegeEmailDomains.includes(domain)) {
    throw new ApiError(403, 'Only verified college email domains are allowed');
  }

  return domain;
};

const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password, campusArea } = req.body;
  const normalizedEmail = email.toLowerCase();
  const collegeDomain = assertAllowedDomain(normalizedEmail);

  const otpPayload = createOtpPayload();

  let user = await User.findOne({ email: normalizedEmail }).select('+otpHash +otpExpiresAt +password');

  if (user?.isEmailVerified) {
    throw new ApiError(409, 'Email already registered');
  }

  if (user) {
    user.fullName = fullName;
    user.password = password;
    user.campusArea = campusArea || user.campusArea;
    user.collegeDomain = collegeDomain;
    user.otpHash = otpPayload.otpHash;
    user.otpExpiresAt = otpPayload.otpExpiresAt;
    user.isEmailVerified = false;
  } else {
    user = new User({
      fullName,
      email: normalizedEmail,
      password,
      campusArea: campusArea || '',
      collegeDomain,
      otpHash: otpPayload.otpHash,
      otpExpiresAt: otpPayload.otpExpiresAt,
      isEmailVerified: false
    });
  }

  await user.save();
  await sendOtpEmail({ email: normalizedEmail, otp: otpPayload.otp });

  return sendResponse(res, 201, 'Signup initiated. Verify OTP sent to email.', {
    email: normalizedEmail
  });
});

const verifySignupOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select('+otpHash +otpExpiresAt');
  if (!user) throw new ApiError(404, 'User not found');

  const isValid = verifyOtp({
    plainOtp: otp,
    hashedOtp: user.otpHash,
    expiresAt: user.otpExpiresAt
  });

  if (!isValid) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  user.isEmailVerified = true;
  user.otpHash = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  const token = signToken({ userId: user._id, role: user.role });

  return sendResponse(res, 200, 'Email verified successfully', {
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

const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email.toLowerCase();
  assertAllowedDomain(normalizedEmail);

  const user = await User.findOne({ email: normalizedEmail }).select('+otpHash +otpExpiresAt');
  if (!user) throw new ApiError(404, 'User not found');

  if (user.isEmailVerified) {
    throw new ApiError(400, 'Email is already verified');
  }

  const otpPayload = createOtpPayload();
  user.otpHash = otpPayload.otpHash;
  user.otpExpiresAt = otpPayload.otpExpiresAt;
  await user.save();

  await sendOtpEmail({ email: normalizedEmail, otp: otpPayload.otp });

  return sendResponse(res, 200, 'OTP resent successfully');
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  assertAllowedDomain(normalizedEmail);

  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) throw new ApiError(401, 'Invalid email or password');

  if (!user.isEmailVerified) {
    throw new ApiError(403, 'Email not verified');
  }

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
  verifySignupOtp,
  resendOtp,
  login,
  logout,
  me
};
