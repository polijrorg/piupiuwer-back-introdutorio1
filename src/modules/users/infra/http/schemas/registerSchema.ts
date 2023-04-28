import { body } from 'express-validator';

const registerSchema = [
  body('username').isString(),
  body('email').isEmail().normalizeEmail().withMessage('Email must contain a valid email address.'),
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long.'),
  body('firstName').isString(),
  body('lastName').isString(),
  body('birthDate').isString(),
  body('about').optional().isString(),
  body('avatar').optional().isString(),
];

export default registerSchema;
