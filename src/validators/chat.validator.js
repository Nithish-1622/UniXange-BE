const { body, param } = require('express-validator');

const createConversationValidator = [
  body('participantId').isMongoId(),
  body('listingId').optional().isMongoId()
];

const conversationIdValidator = [
  param('id').isMongoId()
];

const sendMessageValidator = [
  param('id').isMongoId(),
  body('content').trim().isLength({ min: 1, max: 2000 })
];

module.exports = {
  createConversationValidator,
  conversationIdValidator,
  sendMessageValidator
};
