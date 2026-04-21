/**
 * ApiError - Custom Error Class with HTTP Status Codes
 * 
 * This class extends the native Error class and adds HTTP status code support.
 * Used throughout the application to throw errors with specific HTTP responses.
 * 
 * Features:
 * - Extends native Error for proper stack traces
 * - Includes statusCode property (defaults to 500)
 * - Provides static factory methods for common HTTP errors
 * - Caught by centralized error middleware and converted to JSON responses
 * 
 * Usage Examples:
 * throw ApiError.notFound('User not found');
 * throw ApiError.badRequest('Email is required');
 * throw ApiError.unauthorized('Invalid credentials');
 * throw new ApiError('Custom error', 418);
 * 
 * HTTP Status Codes:
 * - 400: Bad Request (invalid input)
 * - 401: Unauthorized (missing/invalid credentials)
 * - 403: Forbidden (insufficient permissions)
 * - 404: Not Found (resource doesn't exist)
 * - 409: Conflict (duplicate entry, state conflict)
 * - 500: Internal Server Error (unexpected errors)
 */

class ApiError extends Error {
  /**
   * Create a new ApiError instance.
   * 
   * @param {string} message - The error message to display
   * @param {number} statusCode - The HTTP status code (default: 500)
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }

  // ============================================
  // Static Factory Methods for Common Errors
  // ============================================
  /**
   * 400 Bad Request - Invalid client input
   * Use when: Input validation fails, missing required fields, invalid format
   * @param {string} msg - Error message
   * @returns {ApiError}
   */
  static badRequest(msg) {
    return new ApiError(msg, 400);
  }

  /**
   * 401 Unauthorized - Missing or invalid credentials
   * Use when: No auth token, expired token, invalid signature
   * @param {string} msg - Error message (default: 'Unauthorized')
   * @returns {ApiError}
   */
  static unauthorized(msg = 'Unauthorized') {
    return new ApiError(msg, 401);
  }

  /**
   * 403 Forbidden - Insufficient permissions
   * Use when: User authenticated but lacks required role/permissions
   * @param {string} msg - Error message (default: 'Forbidden')
   * @returns {ApiError}
   */
  static forbidden(msg = 'Forbidden') {
    return new ApiError(msg, 403);
  }

  /**
   * 404 Not Found - Resource doesn't exist
   * Use when: Requested record/resource not found in database
   * @param {string} msg - Error message (default: 'Not found')
   * @returns {ApiError}
   */
  static notFound(msg = 'Not found') {
    return new ApiError(msg, 404);
  }

  /**
   * 409 Conflict - Resource state conflict
   * Use when: Duplicate unique constraint, invalid state transition
   * @param {string} msg - Error message
   * @returns {ApiError}
   */
  static conflict(msg) {
    return new ApiError(msg, 409);
  }
}

module.exports = ApiError;
