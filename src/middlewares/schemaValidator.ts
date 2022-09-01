import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import httpStatus from '../utils/httpStatus';

function validateSchema(schema: ObjectSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .send(error.details.map((e) => e.message).join(', '));
    }

    next();
  };
}

export default validateSchema;
