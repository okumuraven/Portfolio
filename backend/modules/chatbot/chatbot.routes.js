const express = require('express');
const router = express.Router();
const ChatbotController = require('./chatbot.controller');
const rateLimit = require('express-rate-limit');

// Max 10 messages per 15 minutes per IP to prevent LLM abuse
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: { error: "Too many requests. Please try again later or contact me directly via /contact." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/status', ChatbotController.getStatus);
router.post('/', chatLimiter, ChatbotController.handleChat);

module.exports = router;
