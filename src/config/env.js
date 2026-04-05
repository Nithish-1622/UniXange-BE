const dotenv = require('dotenv');

dotenv.config();

const required = ['MONGO_URI', 'JWT_SECRET'];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  collegeEmailSuffix: (process.env.COLLEGE_EMAIL_SUFFIX || '@jainuniversity.ac.in').toLowerCase(),
  collegeEmailDomains: (process.env.COLLEGE_EMAIL_DOMAINS || '')
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean),
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
  otpExpiryMinutes: Number(process.env.OTP_EXPIRY_MINUTES) || 10
};

module.exports = env;
