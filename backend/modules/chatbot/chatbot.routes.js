const express = require('express');
const router = express.Router();
const ChatbotController = require('./chatbot.controller');
const rateLimit = require('express-rate-limit');
const { setCacheControl } = require('../../middlewares/cache.middleware');

// Max 10 messages per 15 minutes per IP to prevent LLM abuse
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: { error: "Too many requests. Please try again later or contact me directly via /contact." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/status', setCacheControl(), ChatbotController.getStatus);
router.post('/', chatLimiter, ChatbotController.handleChat);

module.exports = router;
