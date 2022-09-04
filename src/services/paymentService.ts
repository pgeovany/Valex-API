import * as paymentRepository from '../repositories/paymentRepository';
import * as cardService from '../services/cardService';
import * as businessService from '../services/businessService';
import * as cardUtils from '../utils/cardUtils';
import { Card } from '../repositories/cardRepository';

async function newPayment(
  cardId: number,
  cardPassword: string,
  businessId: number,
  amount: number
) {
  const card = await cardService.getCardById(cardId);
  await validateCard(card, cardPassword);
  const business = await businessService.getBusinessById(businessId);

  if (card.type !== business.type) {
    throw {
      type: 'error_bad_request',
      message: 'This business does not allow payments with this type of card!',
    };
  }

  const { balance } = await cardService.getCardTransactions(cardId);

  if (amount > balance) {
    throw {
      type: 'error_bad_request',
      message: 'Insufficient funds!',
    };
  }

  await paymentRepository.insert({ cardId, businessId, amount });

  return;
}

async function validateCard(card: Card, password: string) {
  await cardUtils.validateCardPassword(card.password, password);
  cardUtils.isExpired(card.expirationDate);
  cardUtils.isActive(card.password);

  if (card.isBlocked) {
    throw {
      type: 'error_bad_request',
      message: 'This card is blocked!',
    };
  }
}

export { newPayment };
