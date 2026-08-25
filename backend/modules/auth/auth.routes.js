const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const authController = require('./auth.controller');
const { validateLogin, validateRegister } = require('./auth.validation');
const requireAuth = require('./auth.middleware'); // ✅ Default import, not destructured

// Brute-force protection: password/TOTP/recovery-code guesses are all limited per IP.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// === AUTH ROUTES ===

// POST /api/auth/login - Handle administrator login, return JWT or 2FA challenge
router.post('/login', loginLimiter, validateLogin, authController.login);

// POST /api/auth/login/2fa - Handle the second step of 2FA login
router.post('/login/2fa', loginLimiter, authController.login2FA);

// GET /api/auth/me - Return current user info (JWT required)
router.get('/me', requireAuth(), authController.me);

// 2FA Management (Requires JWT)
router.post('/2fa/setup', requireAuth(), authController.setup2FA);
router.post('/2fa/verify', loginLimiter, requireAuth(), authController.verifyAndEnable2FA);
router.post('/2fa/disable', loginLimiter, requireAuth(), authController.disable2FA);

// POST /api/auth/logout - (Stateless JWT: just a stub for extensibility)
router.post('/logout', requireAuth(), authController.logout);

// POST /api/auth/register - Admin registration (enable as needed)
router.post('/register', loginLimiter, validateRegister, authController.register);

// POST /api/auth/refresh - For refresh tokens (future support)
// router.post('/refresh', authController.refresh);

module.exports = router;