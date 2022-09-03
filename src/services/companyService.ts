import * as companyRepository from '../repositories/companyRepository';

async function getCompanyByApiKey(key: string) {
  const company = await companyRepository.findByApiKey(key);

  if (!company) {
    throw {
      type: 'error_unauthorized',
      message: 'Invalid API key!',
    };
  }

  return company;
}

export { getCompanyByApiKey };
