import { body } from 'express-validator';

/**
 * Validation rules for borrowing a book.
 */
export const borrowBookValidator = [
  body('memberId')
    .notEmpty()
    .withMessage('Member ID is required')
    .isMongoId()
    .withMessage('Invalid Member ID format'),
  body('bookId')
    .notEmpty()
    .withMessage('Book ID is required')
    .isMongoId()
    .withMessage('Invalid Book ID format'),
];
