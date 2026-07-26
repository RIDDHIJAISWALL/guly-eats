import { ZodError } from 'zod';

/**
 * Middleware factory that validates request body/query/params against a Zod schema
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {'body' | 'query' | 'params'} source - Where to find the data
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const data = schema.parse(req[source]);
      // Replace with parsed/cleaned data
      req[source] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));

        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: messages,
        });
      }
      next(error);
    }
  };
};

export default validate;
