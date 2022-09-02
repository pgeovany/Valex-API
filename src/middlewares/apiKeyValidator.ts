import { Request, Response, NextFunction } from 'express';
import httpStatus from '../utils/httpStatus';

async function apiKeyValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { ['x-api-key']: apiKey } = req.headers;

  if (!apiKey) {
    return res.status(httpStatus.BAD_REQUEST).send('Missing x-api-key header.');
  }

  res.locals = {
    apiKey,
  };

  next();
}

export default apiKeyValidator;
