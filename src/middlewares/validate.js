import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware to process express-validator results.
 * Evaluates request validation chains and passes an ApiError to next() if validation fails.
 * 
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next callback
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const formattedErrors = errors.array().map((err) => ({
    field: err.path || err.param,
    message: err.msg,
  }));

  return next(new ApiError(400, 'Validation Failed', formattedErrors));
};

export default validate;
