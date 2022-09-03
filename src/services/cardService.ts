import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import cryptr from '../utils/cryptr';
import encrypt from '../utils/encrypt';
import * as cardRepository from '../repositories/cardRepository';
import * as employeeRepository from '../repositories/employeeRepository';
import * as companyRepository from '../repositories/companyRepository';

async function generateNewCard(
  employeeId: number,
  cardType: cardRepository.TransactionTypes,
  apiKey: string
) {
  const { employee } = await validateNewCardInfo(employeeId, cardType, apiKey);

  const card = generateCardInfo(employee, cardType);

  await cardRepository.insert(card);
}

async function activateCard(id: number, cvv: string, password: string) {
  const card = await getCardById(id);

  validateCardCvv(card.securityCode, cvv);
  isExpired(card.expirationDate);

  if (isActivated(card.password)) {
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

async function validateNewCardInfo(
  employeeId: number,
  cardType: cardRepository.TransactionTypes,
  apiKey: string
) {
  const company = await companyRepository.findByApiKey(apiKey);
  if (!company) {
    throw {
      type: 'error_unauthorized',
      message: 'Invalid API key!',
    };
  }

  const employee = await employeeRepository.findById(employeeId);
  if (!employee) {
    throw {
      type: 'error_not_found',
      message: 'Employee not found!',
    };
  }

  const card = await cardRepository.findByTypeAndEmployeeId(
    cardType,
    employeeId
  );

  if (card) {
    throw {
      type: 'error_conflict',
      message: 'The given employee already have a card of this type.',
    };
  }

  return { employee };
}

async function getCardById(id: number) {
  const card = await cardRepository.findById(id);

  if (!card) {
    throw {
      type: 'error_not_found',
      message: 'Card not found! Please provide a valid card id.',
    };
  }

  return card;
}

function isExpired(expirationDate: string) {
  const currentDate = dayjs().format('MM/YY');

  if (dayjs(expirationDate).diff(currentDate) >= 0) {
    return false;
  }

  throw {
    type: 'error_bad_request',
    message: 'This card is expired!',
  };
}

function isActivated(password: string) {
  if (password !== null) {
    return true;
  }
  return false;
}

function validateCardCvv(encryptedCvv: string, receivedCvv: string) {
  if (cryptr.decrypt(encryptedCvv) === receivedCvv) {
    return;
  }

  throw {
    type: 'error_unauthorized',
    message: 'Please provide a valid security code!',
  };
}

export { generateNewCard, activateCard };
