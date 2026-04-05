const express = require('express');

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const listingRoutes = require('./listing.routes');
const bookingRoutes = require('./booking.routes');
const chatRoutes = require('./chat.routes');
const lostFoundRoutes = require('./lostFound.routes');
const reportRoutes = require('./report.routes');
const adminRoutes = require('./admin.routes');
const notificationRoutes = require('./notification.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/listings', listingRoutes);
router.use('/bookings', bookingRoutes);
router.use('/chats', chatRoutes);
router.use('/lost-found', lostFoundRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
