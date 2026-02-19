// ValidationError.js
// Usage: throw new ValidationError('Field X is missing');

class ValidationError extends Error {
  constructor(message = "Validation error", code = "VALIDATION_ERROR", errors = null) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
    this.code = code;
    if (errors) this.errors = errors; // For extra error detail array, if provided
    Error.captureStackTrace(this, ValidationError);
  }
}

module.exports = ValidationError;