import { Request, Response } from 'express';
import httpStatus from '../utils/httpStatus';
import * as paymentService from '../services/paymentService';

async function payment(req: Request, res: Response) {
  const { cardId, cardPassword, businessId, amount } = req.body;

  await paymentService.newPayment(cardId, cardPassword, businessId, amount);

  res.sendStatus(httpStatus.OK);
}

export { payment };
