import Cryptr from 'cryptr';
import dotent from 'dotenv';

dotent.config();

const cryptr = new Cryptr(process.env.CRYPTR_SECRET);

export default cryptr;
