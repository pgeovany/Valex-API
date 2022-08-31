import { Request, Response } from 'express';
import httpStatus from '../utils/httpStatus';

function errorHandler(error: any, req: Request, res: Response, next: any) {
  return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
}

export default errorHandler;
