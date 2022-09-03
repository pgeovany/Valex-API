import { Request, Response } from 'express';
import httpStatus from '../utils/httpStatus';
import * as cardService from '../services/cardService';

async function newCard(req: Request, res: Response) {
  const { apiKey } = res.locals;
  const { employeeId, cardType } = req.body;

  await cardService.generateNewCard(employeeId, cardType, apiKey);
  res.sendStatus(httpStatus.CREATED);
}

async function activateCard(req: Request, res: Response) {
  const { id, cvv, password } = req.body;

  await cardService.activateCard(id, cvv, password);
  res.sendStatus(httpStatus.OK);
}

async function getCardBalanceAndTransactions(req: Request, res: Response) {
  const { id } = req.params;

  const result = await cardService.getCardTransactions(Number(id));

  res.status(httpStatus.OK).send(result);
}

export { newCard, activateCard, getCardBalanceAndTransactions };
