const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createReport } = require('../controllers/report.controller');
const { createReportValidator } = require('../validators/report.validator');

const router = express.Router();

router.use(protect);
router.post('/', createReportValidator, validate, createReport);

module.exports = router;
