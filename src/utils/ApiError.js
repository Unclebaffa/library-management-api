/**
 * Custom Error class for operational API errors.
 * Extends native Error to encapsulate HTTP status codes, error payloads, and stack traces.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Descriptive error message
   * @param {Array} errors - Detailed array of error messages or validation failures
   * @param {string} stack - Custom stack trace string
   */
  constructor(
    statusCode = 500,
    message = 'Something went wrong',
    errors = [],
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = false;
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
