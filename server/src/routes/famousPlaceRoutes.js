import { Router } from 'express';
import { getFamousPlaces, getFamousPlaceBySlug } from '../controllers/famousPlaceController.js';

const router = Router();

router.get('/', getFamousPlaces);
router.get('/:slug', getFamousPlaceBySlug);

export default router;
