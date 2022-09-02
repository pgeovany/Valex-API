import { NextFunction, Request, Response } from 'express';
import httpStatus from '../utils/httpStatus';

function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  switch (error.type) {
    case 'error_unauthorized':
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    case 'error_not_found':
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    case 'error_conflict':
      return res.status(httpStatus.CONFLICT).send(error.message);
    default:
      return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export default errorHandler;
