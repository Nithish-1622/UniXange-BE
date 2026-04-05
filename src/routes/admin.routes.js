const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  getReports,
  updateReportStatus,
  moderateListing,
  moderateLostFound
} = require('../controllers/admin.controller');
const { reportStatusValidator } = require('../validators/report.validator');
const { moderateListingValidator, moderateLostFoundValidator } = require('../validators/admin.validator');

const router = express.Router();

router.use(protect, requireRole('admin'));

router.get('/reports', getReports);
router.patch('/reports/:id/status', reportStatusValidator, validate, updateReportStatus);
router.patch('/listings/:id/moderate', moderateListingValidator, validate, moderateListing);
router.patch('/lost-found/:id/moderate', moderateLostFoundValidator, validate, moderateLostFound);

module.exports = router;
