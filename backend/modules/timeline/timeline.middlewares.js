const { body, validationResult } = require("express-validator");

/**
 * Validate request body for creating a timeline event.
 * Ensures all required fields and types are correct with built-in conversion.
 */
const validateTimelineEvent = [
  body("type")
    .notEmpty().withMessage("Event type is required.")
    .isString().withMessage("Event type must be a string.")
    .isLength({ max: 32 }).withMessage("Event type must be at most 32 chars."),

  body("title")
    .notEmpty().withMessage("Event title is required.")
    .isString().withMessage("Event title must be a string.")
    .isLength({ max: 256 }).withMessage("Event title must be at most 256 chars."),

  body("date_start")
    .notEmpty().withMessage("Start date is required.")
    .isISO8601().withMessage("Start date must be a valid date (YYYY-MM-DD)."),

  body("date_end")
    .optional({ nullable: true })
    .isISO8601().withMessage("End date must be a valid date (YYYY-MM-DD)."),

  body("description")
    .optional({ nullable: true })
    .isString().withMessage("Description must be a string."),

  body("icon")
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 255 }).withMessage("Icon must be a string of max 255 chars."),

  body("proof_link")
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 1024 }).withMessage("Proof link must be a string of max 1024 chars."),

  body("provider")
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 64 }).withMessage("Provider must be a string of max 64 chars."),

  body("provider_event_id")
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 128 }).withMessage("Provider event id must be a string of max 128 chars."),

  body("visible")
    .optional()
    .toBoolean()
    .isBoolean().withMessage("Visible must be boolean."),

  body("reviewed")
    .optional()
    .toBoolean()
    .isBoolean().withMessage("Reviewed must be boolean."),

  body("automated")
    .optional()
    .toBoolean()
    .isBoolean().withMessage("Automated must be boolean."),

  body("skill_ids")
    .optional({ nullable: true })
    .customSanitizer((value) =>
      Array.isArray(value)
        ? value
        : (typeof value === "string" && value.length)
          ? JSON.parse(value)
          : [])
    .isArray().withMessage("Skill IDs must be an array of integers."),

  body("order")
    .optional({ nullable: true })
    .toInt()
    .isInt().withMessage("Order must be an integer."),

  body("source")
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 32 }).withMessage("Source must be a string of max 32 chars."),

  // Custom error responder for all validation
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array().map(e => ({
          field: e.param,
          message: e.msg,
        })),
      });
    }
    next();
  }
];

/**
 * Validate patch request for updating a timeline event (all fields optional).
 */
const validateTimelinePatch = [
  ...validateTimelineEvent.slice(0, -1), // use same validations as above except custom error handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array().map(e => ({
          field: e.param,
          message: e.msg,
        })),
      });
    }
    next();
  }
];

module.exports = {
  validateTimelineEvent,
  validateTimelinePatch,
};