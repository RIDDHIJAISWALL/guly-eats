import { Router } from 'express';
import { 
  getMe, 
  updateProfile, 
  updatePassword, 
  getWishlist, 
  toggleWishlist 
} from '../controllers/userController.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = Router();

// TEMPORARY ROUTE TO MAKE ALL USERS ADMIN
router.get('/make-all-admin', async (req, res) => {
  try {
    await User.updateMany({}, { role: 'admin' });
    res.send('Success! All users are now admins. Go back to the app and refresh.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// All user routes are protected
router.use(protect);

router.get('/me', getMe);
router.put('/profile', upload.single('avatar'), updateProfile);
router.put('/password', updatePassword);
router.get('/wishlist', getWishlist);
router.post('/wishlist', toggleWishlist);

export default router;
