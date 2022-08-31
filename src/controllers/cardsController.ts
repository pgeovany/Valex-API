import { Request, Response } from 'express';
import httpStatus from '../utils/httpStatus';
// import * as cardRepository from '../repositories/cardRepository';

async function newCard(req: Request, res: Response) {
  res.sendStatus(httpStatus.OK);
}

export { newCard };
