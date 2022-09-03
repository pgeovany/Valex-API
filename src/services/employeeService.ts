import * as employeeRepository from '../repositories/employeeRepository';

async function getEmployeeById(id: number) {
  const employee = await employeeRepository.findById(id);

  if (!employee) {
    throw {
      type: 'error_not_found',
      message: 'Employee not found!',
    };
  }

  return employee;
}

export { getEmployeeById };
