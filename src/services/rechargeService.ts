import * as rechargeRepository from '../repositories/rechargeRepository';
import * as cardService from '../services/cardService';
import * as cardUtils from '../utils/cardUtils';
import * as employeeService from '../services/employeeService';
import * as companyService from '../services/companyService';

async function rechargeCard(cardId: number, amount: number, apiKey: string) {
  const card = await cardService.getCardById(cardId);
  const employee = await employeeService.getEmployeeById(card.employeeId);
  const company = await companyService.getCompanyByApiKey(apiKey);

  if (employee.companyId !== company.id) {
    throw {
      type: 'error_unauthorized',
      message: 'Invalid employee!',
    };
  }

  cardUtils.isActive(card.password);
  cardUtils.isExpired(card.expirationDate);

  await rechargeRepository.insert({ cardId, amount });
}

export { rechargeCard };
