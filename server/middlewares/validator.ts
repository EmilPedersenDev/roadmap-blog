import { Request, Response, NextFunction } from "express";
import { query, param, body, Result, ValidationChain, ValidationError, validationResult } from 'express-validator';
import logger from "../config/logger.js";
import { ApiValidationError } from "../common/error.js";

export const blogQueryValidator: ValidationChain[] = [
  query('offset').isInt({ min: 0 }).withMessage('Offset must be a positive number'),
  query('limit').isInt({ min: 1, max: 10 }).withMessage('Limit must be between 1 and 10'),
];

export const blogIdValidator: ValidationChain[] = [
  param('id').isInt({ min: 1 }).withMessage('Blog ID must be a positive integer'),
];

export const createBlogValidator: ValidationChain[] = [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('content').notEmpty().trim().withMessage('Content is required'),
  body('user_id').notEmpty().trim().withMessage('User ID is required'),
];

export const updateBlogValidator: ValidationChain[] = [
  param('id').isInt({ min: 1 }).withMessage('Blog ID must be a positive integer'),
  body('title').optional().notEmpty().trim().withMessage('Title cannot be empty if provided'),
  body('content').optional().notEmpty().trim().withMessage('Content cannot be empty if provided'),
];

export const validate = (req: Request, res: Response, next: NextFunction): Response | void => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    const apiValidationError: ApiValidationError = new ApiValidationError('Validation error', 400, errors.array());
    logger.warn(apiValidationError.message, apiValidationError.errors);
    return res.status(apiValidationError.statusCode).send({
      error: apiValidationError.statusCode,
      message: apiValidationError.message,
      errors: apiValidationError.errors,
    });
  }
  return next();
};
