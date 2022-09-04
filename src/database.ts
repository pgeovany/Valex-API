import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const configDatabase: pg.ClientConfig = {
  connectionString: process.env.DATABASE_URL,
};

if (process.env.MODE === 'PROD') {
  configDatabase.ssl = {
    rejectUnauthorized: false,
  };
}

const connection = new Pool(configDatabase);

export { connection };
