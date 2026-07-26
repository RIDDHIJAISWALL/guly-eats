import { Router } from 'express';
import { getCities, getCityBySlug, getFeaturedCities } from '../controllers/cityController.js';

const router = Router();

router.get('/', getCities);
router.get('/featured', getFeaturedCities);
router.get('/:slug', getCityBySlug);

export default router;
