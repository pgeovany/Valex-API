import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import cryptr from '../utils/cryptr';
import encrypt from '../utils/encrypt';
import * as cardRepository from '../repositories/cardRepository';
import * as employeeRepository from '../repositories/employeeRepository';
import * as cardUtils from '../utils/cardUtils';
import * as paymentRepository from '../repositories/paymentRepository';
import * as rechargeRepository from '../repositories/rechargeRepository';

async function getCardById(id: number) {
  const card = await cardRepository.findById(id);

  if (!card) {
    throw {
      type: 'error_not_found',
      message: 'Card not found!',
    };
  }

  return card;
}

async function generateNewCard(
  employeeId: number,
  cardType: cardRepository.TransactionTypes,
  apiKey: string
) {
  const { employee } = await cardUtils.validateNewCardInfo(
    employeeId,
    cardType,
    apiKey
  );

  const card = generateCardInfo(employee, cardType);
  const { id } = await cardRepository.insert(card);

  return {
    cardId: id,
    cardholderName: card.cardholderName,
    number: card.number,
    cvv: cryptr.decrypt(card.securityCode),
    type: card.type,
  };
}

async function activateCard(id: number, cvv: string, password: string) {
  const card = await cardUtils.getCardById(id);

  cardUtils.validateCardCvv(card.securityCode, cvv);
  cardUtils.isExpired(card.expirationDate);

  if (card.password) {
    throw {
      type: 'error_bad_request',
      message: 'This card has already been activated!',
    };
  }

  const passwordHash = await encrypt(password);
  await cardRepository.update(id, { password: passwordHash });
}

function generateCardInfo(
  employee: employeeRepository.Employee,
  type: cardRepository.TransactionTypes
): cardRepository.CardInsertData {
  const number = faker.finance.creditCardNumber();
  const securityCode = faker.finance.creditCardCVV();
  const expirationDate = dayjs().add(5, 'year').format('MM/YY');
  const cardholderName = getFormattedName(employee.fullName);

  return {
    number,
    employeeId: employee.id,
    cardholderName,
    securityCode: cryptr.encrypt(securityCode),
    expirationDate,
    password: null,
    isVirtual: false,
    originalCardId: null,
    isBlocked: false,
    type,
  };
}

function getFormattedName(fullName: string): string {
  fullName = fullName.toUpperCase();
  const names = fullName.split(' ');
  let middleNamesInitials: string[] = [];

  const firstName = names[0];
  const lastName = names[names.length - 1];

  names.slice(1, -1).forEach((name) => {
    if (name.length > 2) {
      middleNamesInitials.push(name.charAt(0));
    }
  });

  return [firstName, ...middleNamesInitials, lastName].join(' ');
}

async function getCardTransactions(id: number) {
  await getCardById(id);
  const payments = await paymentRepository.findByCardId(id);
  const recharges = await rechargeRepository.findByCardId(id);

  const balance = getCardBalance(payments, recharges);

  return { balance, transactions: payments, recharges };
}

function getCardBalance(
  payments: paymentRepository.Payment[],
  recharges: rechargeRepository.Recharge[]
) {
  let totalPaymentsAmount: number = 0;
  let totalRechargesAmount: number = 0;

  payments.forEach((payment: paymentRepository.Payment) => {
    totalPaymentsAmount += payment.amount;
  });

  recharges.forEach((recharge: rechargeRepository.Recharge) => {
    totalRechargesAmount += recharge.amount;
  });

  return totalRechargesAmount - totalPaymentsAmount;
}

async function blockCard(id: number, password: string) {
  const card = await cardUtils.getCardById(id);

  await cardUtils.validateCardPassword(card.password, password);
  cardUtils.isExpired(card.expirationDate);

  if (card.isBlocked) {
    throw {
      type: 'error_bad_request',
      message: 'This card has already been blocked!',
    };
  }

  await cardRepository.update(id, { isBlocked: true });

  return;
}

async function unblockCard(id: number, password: string) {
  const card = await cardUtils.getCardById(id);

  await cardUtils.validateCardPassword(card.password, password);
  cardUtils.isExpired(card.expirationDate);

  if (!card.isBlocked) {
    throw {
      type: 'error_bad_request',
      message: 'This card is not blocked!',
    };
  }

  await cardRepository.update(id, { isBlocked: false });

  return;
}

export {
  generateNewCard,
  activateCard,
  getCardTransactions,
  blockCard,
  unblockCard,
  getCardById,
};
