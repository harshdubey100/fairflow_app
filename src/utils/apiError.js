/**
 * ApiError - Custom error class with HTTP status codes.
 */
class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }

  static badRequest(msg) { return new ApiError(msg, 400); }
  static unauthorized(msg = 'Unauthorized') { return new ApiError(msg, 401); }
  static forbidden(msg = 'Forbidden') { return new ApiError(msg, 403); }
  static notFound(msg = 'Not found') { return new ApiError(msg, 404); }
  static conflict(msg) { return new ApiError(msg, 409); }
}

module.exports = ApiError;
