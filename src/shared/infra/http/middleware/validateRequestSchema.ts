import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

const validateRequestSchema = (req: Request, res: Response, next: NextFunction): Response |void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }); }

  return next();
};

export default validateRequestSchema;
