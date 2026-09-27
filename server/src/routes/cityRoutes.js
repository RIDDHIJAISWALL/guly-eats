import { Router } from 'express';
import { getCities, getCityBySlug, getFeaturedCities, createCity, updateCity, deleteCity } from '../controllers/cityController.js';

const router = Router();

router.get('/', getCities);
router.get('/featured', getFeaturedCities);
router.post('/', createCity);
router.put('/:id', updateCity);
router.delete('/:id', deleteCity);
router.get('/:slug', getCityBySlug);

export default router;
