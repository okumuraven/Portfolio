const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const { validateLogin, validateRegister } = require('./auth.validation');
const requireAuth = require('./auth.middleware'); // ✅ Default import, not destructured

// === AUTH ROUTES ===

// POST /api/auth/login - Handle administrator login, return JWT or 2FA challenge
router.post('/login', validateLogin, authController.login);

// POST /api/auth/login/2fa - Handle the second step of 2FA login
router.post('/login/2fa', authController.login2FA);

// GET /api/auth/me - Return current user info (JWT required)
router.get('/me', requireAuth(), authController.me);

// 2FA Management (Requires JWT)
router.post('/2fa/setup', requireAuth(), authController.setup2FA);
router.post('/2fa/verify', requireAuth(), authController.verifyAndEnable2FA);
router.post('/2fa/disable', requireAuth(), authController.disable2FA);

// POST /api/auth/logout - (Stateless JWT: just a stub for extensibility)
router.post('/logout', requireAuth(), authController.logout);

// POST /api/auth/register - Admin registration (enable as needed)
router.post('/register', validateRegister, authController.register);

// POST /api/auth/refresh - For refresh tokens (future support)
// router.post('/refresh', authController.refresh);

module.exports = router;