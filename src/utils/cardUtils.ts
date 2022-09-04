import * as cardRepository from '../repositories/cardRepository';
import * as employeeService from '../services/employeeService';
import * as companyService from '../services/companyService';
import cryptr from '../utils/cryptr';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';

async function validateNewCardInfo(
  employeeId: number,
  cardType: cardRepository.TransactionTypes,
  apiKey: string
) {
  const employee = await employeeService.getEmployeeById(employeeId);
  const company = await companyService.getCompanyByApiKey(apiKey);

  if (employee.companyId !== company.id) {
    throw {
      type: 'error_unauthorized',
      message: 'Invalid employee!',
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

function isActive(password: string) {
  if (password) {
    return true;
  }

  throw {
    type: 'error_bad_request',
    message:
      'You need to activate the card in order to proceed with this request!',
  };
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
  isActive,
  validateCardCvv,
  validateCardPassword,
};
