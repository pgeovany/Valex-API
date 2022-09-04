import { Router } from 'express';
import cardsRouter from './cardsRouter';
import paymentsRouter from './paymentsRouter';

const router = Router();

router.use(cardsRouter);
router.use(paymentsRouter);

export default router;
