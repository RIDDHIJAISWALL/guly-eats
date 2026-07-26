import { Router } from 'express';
import { getReviewsForPlace, addReview, getMyReviews, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/me', protect, getMyReviews);
router.delete('/:id', protect, deleteReview);
router.get('/:placeId', getReviewsForPlace);
router.post('/:placeId', protect, addReview);

export default router;
