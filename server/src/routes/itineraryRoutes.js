import { Router } from 'express';
import { 
  getMyItineraries,
  createItinerary,
  deleteItinerary
} from '../controllers/itineraryController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', getMyItineraries);
router.post('/', createItinerary);
router.delete('/:id', deleteItinerary);

export default router;
