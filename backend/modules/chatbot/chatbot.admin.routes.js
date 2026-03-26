const express = require('express');
const router = express.Router();
const ChatbotAdminController = require('./chatbot.admin.controller');
const requireAdmin = require('../auth/auth.middleware');

// Use the existing auth middleware to protect these routes
router.use(requireAdmin());

router.get('/', ChatbotAdminController.getConfig);
router.put('/', ChatbotAdminController.updateConfig);

module.exports = router;
