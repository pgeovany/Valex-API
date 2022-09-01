import { Router } from 'express';
import validateSchema from '../middlewares/schemaValidator';
import { newCard } from '../controllers/cardsController';
import { createCardSchema } from '../utils/schemas';
import apiKeyValidator from '../middlewares/apiKeyValidator';

const cardsRouter = Router();

cardsRouter.post(
  '/cards',
  validateSchema(createCardSchema),
  apiKeyValidator,
  newCard
);

export default cardsRouter;
