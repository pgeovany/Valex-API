import { Router } from 'express';
import { newCard } from '../controllers/cardsController';

const cardsRouter = Router();

cardsRouter.post('/cards', newCard);

export default cardsRouter;
