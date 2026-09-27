import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  refresh,
  forgotPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/forgotpassword', forgotPassword);
router.get('/logout', logout);
router.get('/me', protect, getMe);

export default router;
