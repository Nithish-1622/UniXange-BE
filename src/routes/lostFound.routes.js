const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createLostFound,
  getLostFoundList,
  getLostFoundById,
  updateLostFound,
  matchLostFound
} = require('../controllers/lostFound.controller');
const {
  createLostFoundValidator,
  lostFoundIdValidator,
  updateLostFoundValidator,
  lostFoundQueryValidator,
  matchLostFoundValidator
} = require('../validators/lostFound.validator');

const router = express.Router();

router.get('/', lostFoundQueryValidator, validate, getLostFoundList);
router.post('/', protect, createLostFoundValidator, validate, createLostFound);
router.get('/:id', lostFoundIdValidator, validate, getLostFoundById);
router.patch('/:id', protect, lostFoundIdValidator, updateLostFoundValidator, validate, updateLostFound);
router.post('/:id/match', protect, matchLostFoundValidator, validate, matchLostFound);

module.exports = router;
