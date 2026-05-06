const express = require('express');
const router = express.Router();
const RecoveryController = require('./recovery.controller');
const requireAuth = require('../auth/auth.middleware');

// All recovery routes require admin role
router.use(requireAuth(['admin']));

router.get('/status', RecoveryController.getStatus);
router.post('/log-urge', RecoveryController.logUrge);
router.post('/reset', RecoveryController.resetStreak);
router.post('/panic', RecoveryController.panic);

router.post('/reasons', RecoveryController.addReason);
router.delete('/reasons/:id', RecoveryController.removeReason);
router.post('/chat', RecoveryController.chat);
router.post('/generate-briefing', RecoveryController.generateBriefing);
router.post('/surgical-reset', RecoveryController.surgicalReset);

module.exports = router;
