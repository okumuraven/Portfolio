const Joi = require('joi');

/**
 * Validation for admin login (email, password)
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required()
});

/**
 * (Optional) Registration validation
 * Adapt/expand as needed for your project
 */
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/[a-z]/, 'lowercase')
    .pattern(/[A-Z]/, 'uppercase')
    .pattern(/[0-9]/, 'digit')
    .pattern(/[^a-zA-Z0-9]/, 'symbol')
    .required()
    .messages({
      "string.pattern.base": "Password must have uppercase, lowercase, digit, and symbol."
    }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    .messages({
      "any.only": "Passwords do not match."
    }),
});

/**
 * Ready-to-use express middleware for login
 */
const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details?.[0]?.message || "Invalid login payload" });
  }
  next();
};

/**
 * (Optional) Ready-to-use express middleware for registration
 */
const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details?.[0]?.message || "Invalid registration data." });
  }
  next();
};

module.exports = {
  loginSchema,
  registerSchema,
  validateLogin,
  validateRegister,
};