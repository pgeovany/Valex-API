import bcrypt from 'bcrypt';

async function encrypt(password: string) {
  const SALT = 10;
  return bcrypt.hashSync(password, SALT);
}

export default encrypt;
