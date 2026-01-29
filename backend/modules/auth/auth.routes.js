const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const { validateLogin, validateRegister } = require('./auth.validation');
const requireAuth = require('../../src/middlewares/auth.middleware');
console.log('MIDDLEWARE DEBUG requireAuth:', requireAuth);

// === AUTH ROUTES ===

// POST /api/auth/login - Handle administrator login, return JWT
router.post('/login', validateLogin, authController.login);

// GET /api/auth/me - Return current user info (JWT required)
router.get('/me', requireAuth(), authController.me);

// POST /api/auth/logout - (Stateless JWT: just a stub for extensibility)
router.post('/logout', requireAuth(), authController.logout);

// POST /api/auth/register - Admin registration (if enabled, optional!)
router.post('/register', validateRegister, authController.register); // Uncomment and implement registration if desired

// POST /api/auth/refresh - For refresh tokens if you add support
// router.post('/refresh', authController.refresh);

module.exports = router;