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
    if (!result || !result.token) {
      // Generic message (do not leak which field is invalid)
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // For production: set as httpOnly cookie, but many SPAs use JSON for localStorage
    res.json({ accessToken: result.token, user: result.user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /api/auth/me 
 * (requires JWT auth middleware, e.g. req.user)
 * Returns the current authenticated user's profile.
 */
exports.me = async (req, res) => {
  if (!req.user)
    return res.status(401).json({ error: "Unauthorized" });
  try {
    // You could enhance: refetch full user record from DB if desired
    res.json({ user: req.user });
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