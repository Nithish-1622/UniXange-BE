const mongoose = require('mongoose');

const availabilityWindowSchema = new mongoose.Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  { _id: false }
);

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    type: {
      type: String,
      enum: ['buy', 'sell', 'rent'],
      required: true,
      index: true
    },
    images: [{ type: String }],
    campusArea: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'flagged', 'removed', 'sold', 'rented'],
      default: 'active',
      index: true
    },
    rentDetails: {
      perDayPrice: { type: Number, min: 0 },
      minDurationDays: { type: Number, min: 1 },
      maxDurationDays: { type: Number, min: 1 },
      unavailableWindows: [availabilityWindowSchema]
    },
    fraudMeta: {
      suspicious: { type: Boolean, default: false },
      score: { type: Number, default: 0 },
      reasons: [{ type: String }]
    }
  },
  { timestamps: true }
);

listingSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Listing', listingSchema);
