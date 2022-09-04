import { Router } from 'express';
import { payment } from '../controllers/paymentsController';
import validateSchema from '../middlewares/schemaValidator';
import { paymentSchema } from '../utils/schemas';

const paymentsRouter = Router();

paymentsRouter.post('/payment', validateSchema(paymentSchema), payment);

export default paymentsRouter;
