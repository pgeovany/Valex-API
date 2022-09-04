import * as businessRepository from '../repositories/businessRepository';

async function getBusinessById(id: number) {
  const business = await businessRepository.findById(id);

  if (!business) {
    throw {
      type: 'error_not_found',
      message: 'Business not found!',
    };
  }

  return business;
}

export { getBusinessById };
