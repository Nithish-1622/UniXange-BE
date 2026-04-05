const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const env = require('../config/env');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    collegeDomain: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true
    },
    otpHash: {
      type: String,
      select: false
    },
    otpExpiresAt: {
      type: Date,
      select: false
    },
    avatarUrl: {
      type: String,
      default: ''
    },
    campusArea: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: 300,
      default: ''
    },
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing'
    }],
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function userPreSave(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, env.bcryptSaltRounds);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
