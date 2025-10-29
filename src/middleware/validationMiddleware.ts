import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * Validation middleware factory that creates a middleware for a specific Zod schema
 * @param schema - Zod schema to validate against
 * @param target - Where to validate the data ('body', 'query', 'params')
 */
export function validate<T extends z.ZodSchema>(schema: T, target: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[target];
      const result = schema.safeParse(dataToValidate);
      
      if (!result.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: result.error.flatten()
        });
      }
      
      // Attach the validated data to the request object
      (req as any).validated = result.data;
      next();
    } catch (error) {
      return res.status(500).json({
        error: 'Validation error',
        message: 'Internal validation error'
      });
    }
  };
}

/**
 * Type-safe way to get validated data from request
 */
export function getValidatedData<T>(req: Request, target: 'body' | 'query' | 'params' = 'body'): T {
  return (req as any).validated as T;
}
