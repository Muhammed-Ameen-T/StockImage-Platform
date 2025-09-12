import { Request, Response, NextFunction } from 'express';
import { ZodType, z } from 'zod';
import { HttpResCode } from '../../utils/constants/httpResponseCode.utils';
import { sendResponse } from '../../utils/response/sendResponse.utils';

/**
 * Middleware to validate request body using a Zod schema.
 * Responds with a 400 Bad Request if validation fails.
 *
 * @template T - Zod schema type
 * @param {ZodType<T>} schema - The Zod schema used for validation.
 * @returns {Function} Express middleware function.
 */
export const validateRequest = <T>(schema: ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue: z.core.$ZodIssue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');

      sendResponse(res, HttpResCode.BAD_REQUEST, errorMessage);
      return;
    }

    next();
  };
};
