import { body } from 'express-validator';

/**
 * Validation rules for creating a new Book.
 */
export const createBookValidator = [
  body('title')
    .notEmpty()
    .withMessage('Book title is required')
    .isString()
    .withMessage('Title must be a string')
    .trim(),
  body('author')
    .notEmpty()
    .withMessage('Author name is required')
    .isString()
    .withMessage('Author must be a string')
    .trim(),
  body('ISBN')
    .notEmpty()
    .withMessage('ISBN is required')
    .isString()
    .withMessage('ISBN must be a string')
    .trim(),
  body('publicationYear')
    .notEmpty()
    .withMessage('Publication year is required')
    .isInt({ min: 1000, max: new Date().getFullYear() + 1 })
    .withMessage(`Publication year must be a valid 4-digit year`),
  body('genre')
    .notEmpty()
    .withMessage('Genre is required')
    .isString()
    .withMessage('Genre must be a string')
    .trim(),
  body('totalCopies')
    .notEmpty()
    .withMessage('Total copies is required')
    .isInt({ min: 1 })
    .withMessage('Total copies must be an integer of at least 1'),
  body('availableCopies')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available copies must be a non-negative integer'),
];

/**
 * Validation rules for updating an existing Book.
 */
export const updateBookValidator = [
  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string')
    .trim(),
  body('author')
    .optional()
    .isString()
    .withMessage('Author must be a string')
    .trim(),
  body('ISBN')
    .optional()
    .isString()
    .withMessage('ISBN must be a string')
    .trim(),
  body('publicationYear')
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() + 1 })
    .withMessage('Publication year must be a valid 4-digit year'),
  body('genre')
    .optional()
    .isString()
    .withMessage('Genre must be a string')
    .trim(),
  body('totalCopies')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Total copies must be an integer of at least 1'),
  body('availableCopies')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available copies must be a non-negative integer'),
];
