import { Request, Response } from 'express';
import httpStatus from '../utils/httpStatus';
import * as cardService from '../services/cardService';

async function newCard(req: Request, res: Response) {
  const { apiKey } = res.locals;
  const { employeeId, cardType } = req.body;

  await cardService.generateNewCard(employeeId, cardType, apiKey);
  res.sendStatus(httpStatus.CREATED);
}

export { newCard };
