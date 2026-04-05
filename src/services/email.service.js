const sendOtpEmail = async ({ email, otp }) => {
  // In production, integrate SMTP provider (SES/SendGrid/etc).
  console.log(`[DEV EMAIL] OTP for ${email}: ${otp}`);
};

module.exports = { sendOtpEmail };
