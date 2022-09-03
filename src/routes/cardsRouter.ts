import { Router } from 'express';
import validateSchema from '../middlewares/schemaValidator';
import {
  activateCard,
  blockCard,
  getCardBalanceAndTransactions,
  newCard,
  unblockCard,
} from '../controllers/cardsController';
import {
  activateCardSchema,
  blockCardSchema,
  createCardSchema,
} from '../utils/schemas';
import apiKeyValidator from '../middlewares/apiKeyValidator';

const cardsRouter = Router();

cardsRouter.post(
  '/cards',
  validateSchema(createCardSchema),
  apiKeyValidator,
  newCard
);

cardsRouter.get('/cards/:id', getCardBalanceAndTransactions);

cardsRouter.patch(
  '/cards/activate',
  validateSchema(activateCardSchema),
  activateCard
);

cardsRouter.patch('/cards/block', validateSchema(blockCardSchema), blockCard);
cardsRouter.patch(
  '/cards/unblock',
  validateSchema(blockCardSchema),
  unblockCard
);

export default cardsRouter;
