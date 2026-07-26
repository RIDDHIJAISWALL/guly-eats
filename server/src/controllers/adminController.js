import User from '../models/User.js';
import Place from '../models/Place.js';
import FamousPlace from '../models/FamousPlace.js';
import Review from '../models/Review.js';
import * as argon2 from 'argon2';

const SUPERADMIN_EMAIL = 'riddhijaiswal1406@gmail.com';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPlaces = await Place.countDocuments();
    const totalFamousPlaces = await FamousPlace.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Basic mock activity for UI
    const recentUsers = await User.find().sort('-createdAt').limit(5).select('name email createdAt avatar role');

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalPlaces,
        totalFamousPlaces,
        totalReviews,
        recentActivity: recentUsers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ success: false, error: 'User not found' });

    if (targetUser.email === SUPERADMIN_EMAIL) {
      return res.status(403).json({ success: false, error: 'Cannot modify Superadmin role' });
    }

    targetUser.role = req.body.role;
    await targetUser.save();

    res.status(200).json({ success: true, data: targetUser });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ success: false, error: 'User not found' });

    if (targetUser.email === SUPERADMIN_EMAIL) {
      return res.status(403).json({ success: false, error: 'Cannot delete Superadmin' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset user password
// @route   PUT /api/admin/users/:id/reset-password
// @access  Private/Admin
export const resetUserPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ success: false, error: 'User not found' });

    const hashedPassword = await argon2.hash(newPassword);
    
    // We update using findByIdAndUpdate to bypass pre-save hooks if any, though there are none here for password
    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};
