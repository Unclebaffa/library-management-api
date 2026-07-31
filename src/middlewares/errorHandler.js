import ApiError from '../utils/ApiError.js';

/**
 * Global Express error handling middleware.
 * Formats all uncaught errors and ApiError instances into a standardized JSON response.
 *
 * @param {Error|ApiError} err - Caught error object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Transform generic JavaScript errors or database errors into ApiError instance
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  return res.status(error.statusCode).json(response);
};

export default errorHandler;
