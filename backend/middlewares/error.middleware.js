/**
 * Global Express Error Handling Middleware
 *
 * - Logs all errors (including async errors)
 * - Sends proper status codes & messages to client
 * - Hides stack trace and details in production
 * - Supports custom errors with status/code/message
 */

module.exports = function errorMiddleware(err, req, res, next) {
  // Default status code (override for known error types)
  let status = err.status || err.statusCode || 500;
  let code = err.code || "SERVER_ERROR";
  let message = err.message || "Internal Server Error";

  // Known validation (Joi, custom) or NotFound errors
  if (
    Array.isArray(err.errors) && err.errors.length &&
    status === 500
  ) {
    status = 400;
    code = "VALIDATION_ERROR";
    message = err.errors;
  }

  // Log error details for debugging (always log full trace server-side)
  if (status >= 500 || process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error("[ERROR]", {
      message: err.message,
      stack: err.stack,
      status,
      code,
      url: req.originalUrl,
      method: req.method,
      user: req.user?.id,
    });
  }

  // Production: Hide error stack/details
  const response =
    status >= 500 && process.env.NODE_ENV === "production"
      ? { error: "Server Error. Please try again later.", code }
      : { error: message, code, ...(err.errors ? { errors: err.errors } : {}), stack: err.stack };

  res.status(status).json(response);
};