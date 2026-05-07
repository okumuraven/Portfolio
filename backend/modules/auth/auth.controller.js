const authService = require('./auth.service');
const Joi = require('joi');

/**
 * POST /api/auth/login
 * body: { email, password }
 */
exports.login = async (req, res) => {
  // Input validation
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({ error: "Invalid credentials format." });

  const { email, password } = req.body;

  try {
    const result = await authService.login(email, password);
    if (!result) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    if (result.twoFactorRequired) {
      return res.json({ 
        twoFactorRequired: true, 
        userId: result.user.id,
        message: "2FA_REQUIRED" 
      });
    }

    res.json({ accessToken: result.token, user: result.user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /api/auth/login/2fa
 * body: { userId, token }
 */
exports.login2FA = async (req, res) => {
  const schema = Joi.object({
    userId: Joi.number().required(),
    token: Joi.string().length(6).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: "Invalid 2FA token format." });

  const { userId, token } = req.body;

  try {
    const result = await authService.login2FA(userId, token);
    if (!result) {
      return res.status(401).json({ error: "Invalid or expired 2FA token." });
    }

    res.json({ accessToken: result.token, user: result.user });
  } catch (err) {
    console.error("2FA Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /api/auth/2fa/setup
 * body: {}
 * (Requires Authentication)
 */
exports.setup2FA = async (req, res) => {
  try {
    const { secret, qrCodeDataURL } = await authService.setup2FA(req.user.userId);
    res.json({ secret, qrCodeDataURL });
  } catch (err) {
    console.error("2FA Setup error:", err);
    res.status(500).json({ error: "Failed to initialize 2FA setup." });
  }
};

/**
 * POST /api/auth/2fa/verify
 * body: { secret, token }
 * (Requires Authentication)
 */
exports.verifyAndEnable2FA = async (req, res) => {
  const schema = Joi.object({
    secret: Joi.string().required(),
    token: Joi.string().length(6).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: "Invalid setup data." });

  const { secret, token } = req.body;

  try {
    const success = await authService.verifyAndEnable2FA(req.user.userId, secret, token);
    if (!success) {
      return res.status(400).json({ error: "Invalid verification code." });
    }
    res.json({ message: "2FA enabled successfully." });
  } catch (err) {
    console.error("2FA Verify error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /api/auth/2fa/disable
 * (Requires Authentication)
 */
exports.disable2FA = async (req, res) => {
  try {
    await authService.disable2FA(req.user.userId);
    res.json({ message: "2FA disabled successfully." });
  } catch (err) {
    console.error("2FA Disable error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /api/auth/me
 */
exports.me = async (req, res) => {
  if (!req.user)
    return res.status(401).json({ error: "Unauthorized" });
  try {
    const user = await authService.getUserById(req.user.userId);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error getting user data" });
  }
};


/**
 * POST /api/auth/logout
 * (for stateless JWT you typically just clear the cookie on frontend)
 * included for future expansion
 */
exports.logout = (req, res) => {
  // If using httpOnly cookies, clear it here; for localStorage tokens, frontend handles
  res.json({ message: "Logged out (client should delete token)" });
};

/**
 * POST /api/auth/register
 * Placeholder function for registration (returns 501 Not Implemented)
 */
exports.register = (req, res) => {
  res.status(501).json({ error: 'Registration not implemented.' });
};