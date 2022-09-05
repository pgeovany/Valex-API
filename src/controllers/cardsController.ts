import { Request, Response } from 'express';
import httpStatus from '../utils/httpStatus';
import * as cardService from '../services/cardService';
import * as rechargeService from '../services/rechargeService';

async function newCard(req: Request, res: Response) {
  const { apiKey } = res.locals;
  const { employeeId, cardType } = req.body;

  const card = await cardService.generateNewCard(employeeId, cardType, apiKey);

  res.status(httpStatus.CREATED).send(card);
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

async function blockCard(req: Request, res: Response) {
  const { id, password } = req.body;

  await cardService.blockCard(id, password);

  res.sendStatus(httpStatus.OK);
}

async function unblockCard(req: Request, res: Response) {
  const { id, password } = req.body;

  await cardService.unblockCard(id, password);

  res.sendStatus(httpStatus.OK);
}

async function rechargeCard(req: Request, res: Response) {
  const { apiKey } = res.locals;
  const { id, amount } = req.body;

  await rechargeService.rechargeCard(id, amount, apiKey);

  res.sendStatus(httpStatus.OK);
}

export {
  newCard,
  activateCard,
  getCardBalanceAndTransactions,
  blockCard,
  unblockCard,
  rechargeCard,
};
