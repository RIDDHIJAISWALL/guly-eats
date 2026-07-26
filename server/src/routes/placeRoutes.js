import { Router } from 'express';
import { getPlaces, getPlaceBySlug, getNearbyPlaces } from '../controllers/placeController.js';

const router = Router();

router.get('/', getPlaces);
router.get('/nearby', getNearbyPlaces);
router.get('/:slug', getPlaceBySlug);

export default router;
