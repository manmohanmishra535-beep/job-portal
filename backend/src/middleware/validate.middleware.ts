import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Validates (and coerces) the request query string against a flat Zod schema.
 * The transformed/defaulted result is written back to `req.query` so that
 * downstream controllers and services receive numbers and applied defaults
 * instead of the raw strings supplied in the URL.
 */
export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.query);
      // `req.query` is a plain writable own property on the request object,
      // so assigning the parsed result is safe and takes effect downstream.
      req.query = parsed;
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: [(error as Error).message],
      });
    }
  };
}

export function validateBody(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid request body',
        errors: [(error as Error).message],
      });
    }
  };
}
