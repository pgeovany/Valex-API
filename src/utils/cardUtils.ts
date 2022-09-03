import * as cardRepository from '../repositories/cardRepository';
import * as companyRepository from '../repositories/companyRepository';
import * as employeeRepository from '../repositories/employeeRepository';
import cryptr from '../utils/cryptr';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';

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

async function validateCardPassword(
  hashedPassword: string,
  receivedPassword: string
) {
  if (await bcrypt.compareSync(receivedPassword, hashedPassword)) {
    return;
  }

  throw {
    type: 'error_unauthorized',
    message: 'Invalid credentials!',
  };
}

export {
  validateNewCardInfo,
  getCardById,
  isExpired,
  isActivated,
  validateCardCvv,
  validateCardPassword,
};
