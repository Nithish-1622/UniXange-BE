const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['booking_request', 'booking_update', 'chat_message', 'report_update', 'system'],
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 120
    },
    body: {
      type: String,
      required: true,
      maxlength: 500
    },
    meta: {
      type: Object,
      default: {}
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
