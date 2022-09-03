import { Router } from 'express';
import validateSchema from '../middlewares/schemaValidator';
import {
  activateCard,
  getCardBalanceAndTransactions,
  newCard,
} from '../controllers/cardsController';
import { activateCardSchema, createCardSchema } from '../utils/schemas';
import apiKeyValidator from '../middlewares/apiKeyValidator';

const cardsRouter = Router();

cardsRouter.post(
  '/cards',
  validateSchema(createCardSchema),
  apiKeyValidator,
  newCard
);

cardsRouter.post(
  '/cards/activate',
  validateSchema(activateCardSchema),
  activateCard
);

cardsRouter.get('/cards/:id', getCardBalanceAndTransactions);

export default cardsRouter;
