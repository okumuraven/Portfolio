const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const { validateLogin, validateRegister } = require('./auth.validation');
const requireAuth = require('./auth.middleware'); // ✅ Default import, not destructured

// === AUTH ROUTES ===

// POST /api/auth/login - Handle administrator login, return JWT
router.post('/login', validateLogin, authController.login);

// GET /api/auth/me - Return current user info (JWT required)
router.get('/me', requireAuth(), authController.me); // Call as function!

// POST /api/auth/logout - (Stateless JWT: just a stub for extensibility)
router.post('/logout', requireAuth(), authController.logout);

// POST /api/auth/register - Admin registration (enable as needed)
router.post('/register', validateRegister, authController.register);

// POST /api/auth/refresh - For refresh tokens (future support)
// router.post('/refresh', authController.refresh);

module.exports = router;