import express, { json } from 'express';
import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/router';
import errorHandler from './middlewares/errorHandler';

dotenv.config();

const app = express();
app.use(cors(), json());
app.use(router);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
