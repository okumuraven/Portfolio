// NotFoundError.js
// Usage: throw new NotFoundError('Project not found');

class NotFoundError extends Error {
  constructor(message = "Resource not found", code = "NOT_FOUND") {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
    this.code = code;
    Error.captureStackTrace(this, NotFoundError);
  }
}

module.exports = NotFoundError;