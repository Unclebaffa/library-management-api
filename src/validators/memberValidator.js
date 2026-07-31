import { body } from 'express-validator';

/**
 * Validation rules for registering a new Member.
 */
export const createMemberValidator = [
  body('name')
    .notEmpty()
    .withMessage('Member name is required')
    .isString()
    .withMessage('Name must be a string')
    .trim(),
  body('email')
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .isString()
    .withMessage('Phone number must be a string')
    .trim(),
  body('membershipId')
    .optional()
    .isString()
    .withMessage('Membership ID must be a string')
    .trim(),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
    .withMessage('Status must be one of: ACTIVE, INACTIVE, SUSPENDED'),
];

/**
 * Validation rules for updating an existing Member.
 */
export const updateMemberValidator = [
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .isString()
    .withMessage('Phone number must be a string')
    .trim(),
  body('membershipId')
    .optional()
    .isString()
    .withMessage('Membership ID must be a string')
    .trim(),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
    .withMessage('Status must be one of: ACTIVE, INACTIVE, SUSPENDED'),
];
