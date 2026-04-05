const Chat = require('../models/Chat');
const User = require('../models/User');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const sendResponse = require('../utils/response');

const ensureParticipant = (chat, userId) => {
  return chat.participants.some((p) => p.toString() === userId.toString());
};

const createOrGetConversation = asyncHandler(async (req, res) => {
  const { participantId, listingId } = req.body;

  if (participantId === req.user._id.toString()) {
    throw new ApiError(400, 'Cannot create conversation with yourself');
  }

  const participant = await User.findById(participantId);
  if (!participant) throw new ApiError(404, 'Participant not found');

  let chat = await Chat.findOne({
    participants: { $all: [req.user._id, participantId], $size: 2 },
    listing: listingId || null
  })
    .populate('participants', 'fullName avatarUrl')
    .populate('listing', 'title images type status');

  if (!chat) {
    chat = await Chat.create({
      participants: [req.user._id, participantId],
      listing: listingId || null,
      messages: []
    });

    chat = await Chat.findById(chat._id)
      .populate('participants', 'fullName avatarUrl')
      .populate('listing', 'title images type status');
  }

  return sendResponse(res, 200, 'Conversation ready', chat);
});

const getMyConversations = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ participants: req.user._id })
    .populate('participants', 'fullName avatarUrl')
    .populate('listing', 'title images type status')
    .sort({ lastMessageAt: -1 });

  return sendResponse(res, 200, 'Conversations fetched', chats);
});

const getMessages = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.id)
    .populate('messages.sender', 'fullName avatarUrl')
    .populate('participants', 'fullName avatarUrl');

  if (!chat) throw new ApiError(404, 'Conversation not found');

  if (!ensureParticipant(chat, req.user._id)) {
    throw new ApiError(403, 'Unauthorized to access this conversation');
  }

  return sendResponse(res, 200, 'Messages fetched', chat.messages);
});

const sendMessage = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.id).populate('participants', 'fullName avatarUrl');
  if (!chat) throw new ApiError(404, 'Conversation not found');

  if (!ensureParticipant(chat, req.user._id)) {
    throw new ApiError(403, 'Unauthorized to send message in this conversation');
  }

  chat.messages.push({
    sender: req.user._id,
    content: req.body.content,
    readBy: [req.user._id]
  });
  chat.lastMessageAt = new Date();
  await chat.save();

  const others = chat.participants.filter((p) => p._id.toString() !== req.user._id.toString());

  if (others.length) {
    await Notification.create({
      user: others[0]._id,
      type: 'chat_message',
      title: 'New message',
      body: `${req.user.fullName}: ${req.body.content.slice(0, 80)}`,
      meta: { chatId: chat._id }
    });
  }

  const latest = chat.messages[chat.messages.length - 1];

  return sendResponse(res, 201, 'Message sent', latest);
});

module.exports = {
  createOrGetConversation,
  getMyConversations,
  getMessages,
  sendMessage
};
