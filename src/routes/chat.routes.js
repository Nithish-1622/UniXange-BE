const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createOrGetConversation,
  getMyConversations,
  getMessages,
  sendMessage
} = require('../controllers/chat.controller');
const {
  createConversationValidator,
  conversationIdValidator,
  sendMessageValidator
} = require('../validators/chat.validator');

const router = express.Router();

router.use(protect);
router.post('/conversations', createConversationValidator, validate, createOrGetConversation);
router.get('/conversations', getMyConversations);
router.get('/conversations/:id/messages', conversationIdValidator, validate, getMessages);
router.post('/conversations/:id/messages', sendMessageValidator, validate, sendMessage);

module.exports = router;
