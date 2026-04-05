const mongoose = require('mongoose');
const connectDB = require('../config/db');
const env = require('../config/env');
const User = require('../models/User');

const run = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'UniXchange Admin';

    if (!adminEmail || !adminPassword) {
      throw new Error('Provide ADMIN_EMAIL and ADMIN_PASSWORD in environment');
    }

    const domain = (adminEmail.split('@')[1] || '').toLowerCase();
    if (!env.collegeEmailDomains.includes(domain)) {
      throw new Error('ADMIN_EMAIL domain must be in COLLEGE_EMAIL_DOMAINS');
    }

    const existing = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }

    await User.create({
      fullName: adminName,
      email: adminEmail.toLowerCase(),
      collegeDomain: domain,
      password: adminPassword,
      role: 'admin',
      isEmailVerified: true
    });

    console.log('Admin created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

run();
