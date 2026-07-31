/**
 * Standardized API success response wrapper class.
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code (e.g. 200, 201)
   * @param {any} data - Response payload data
   * @param {string} message - Success message description
   */
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export default ApiResponse;
