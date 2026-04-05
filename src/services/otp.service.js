const crypto = require('node:crypto');
const env = require('../config/env');

const generateOtp = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

const hashOtp = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

const createOtpPayload = () => {
  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const otpExpiresAt = new Date(Date.now() + env.otpExpiryMinutes * 60 * 1000);

  return { otp, otpHash, otpExpiresAt };
};

const verifyOtp = ({ plainOtp, hashedOtp, expiresAt }) => {
  if (!hashedOtp || !expiresAt) return false;
  if (new Date(expiresAt).getTime() < Date.now()) return false;

  const incomingHash = hashOtp(plainOtp);
  return incomingHash === hashedOtp;
};

module.exports = { createOtpPayload, verifyOtp };
