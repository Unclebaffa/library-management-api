import ApiError from '../utils/ApiError.js';

/**
 * Enterprise Centralized Express Error Handling Middleware.
 * Catches custom ApiError instances, Mongoose database errors (CastError, DuplicateKey 11000, ValidationError),
 * and formats standardized JSON error responses.
 *
 * @param {Error|ApiError} err - Error object passed to next()
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next middleware callback
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // 1. Mongoose Invalid ObjectId Format (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with invalid ${err.path}: ${err.value}`;
    error = new ApiError(400, message);
  }

  // 2. Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const fieldNames = Object.keys(err.keyValue || {}).join(', ');
    const message = `Duplicate field value entered for '${fieldNames}'. Please use another value`;
    const details = Object.entries(err.keyValue || {}).map(([field, value]) => ({
      field,
      message: `'${value}' already exists for field '${field}'`,
    }));
    error = new ApiError(400, message, details);
  }

  // 3. Mongoose Schema ValidationError
  if (err.name === 'ValidationError') {
    const message = 'Validation Failed';
    const details = Object.values(err.errors || {}).map((val) => ({
      field: val.path,
      message: val.message,
    }));
    error = new ApiError(400, message, details);
  }

  // 4. Ensure error is instance of ApiError
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
