const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['lost', 'found'],
      required: true,
      index: true
    },
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
    images: [{ type: String }],
    campusArea: {
      type: String,
      required: true,
      index: true
    },
    dateOfEvent: {
      type: Date,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['open', 'matched', 'closed', 'flagged'],
      default: 'open',
      index: true
    },
    matchedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LostFound',
      default: null
    },
    matchConfidence: {
      type: Number,
      default: 0,
      min: 0,
      max: 1
    }
  },
  { timestamps: true }
);

lostFoundSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('LostFound', lostFoundSchema);
