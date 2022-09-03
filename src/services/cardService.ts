import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import cryptr from '../utils/cryptr';
import encrypt from '../utils/encrypt';
import * as cardRepository from '../repositories/cardRepository';
import * as employeeRepository from '../repositories/employeeRepository';
import * as cardUtils from '../utils/cardUtils';

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

  await cardRepository.insert(card);
}

async function activateCard(id: number, cvv: string, password: string) {
  const card = await cardUtils.getCardById(id);

  cardUtils.validateCardCvv(card.securityCode, cvv);
  cardUtils.isExpired(card.expirationDate);

  if (cardUtils.isActivated(card.password)) {
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

export { generateNewCard, activateCard };
