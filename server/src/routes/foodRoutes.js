import { Router } from 'express';
import { getFoods, getFoodBySlug } from '../controllers/foodController.js';

const router = Router();

router.get('/', getFoods);
router.get('/:slug', getFoodBySlug);

export default router;
