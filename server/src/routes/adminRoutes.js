import { Router } from 'express';
import { 
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  resetUserPassword
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Secure all admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/reset-password', resetUserPassword);
router.delete('/users/:id', deleteUser);

export default router;
