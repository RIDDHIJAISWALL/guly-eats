import User from '../models/User.js';
import Place from '../models/Place.js';
import FamousPlace from '../models/FamousPlace.js';
import argon2 from 'argon2';

// @desc    Get current logged in user
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
    };

    // If file uploaded
    if (req.file) {
      // Create a URL path relative to the server
      const avatarUrl = `/public/uploads/${req.file.filename}`;
      fieldsToUpdate.avatar = avatarUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/users/password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await argon2.verify(user.password, req.body.currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Incorrect current password' });
    }

    // Hash new password
    user.password = await argon2.hash(req.body.newPassword);
    await user.save();

    res.status(200).json({ success: true, data: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'wishlist.places',
        select: 'name slug type images location city rating numReviews',
        populate: { path: 'city', select: 'name slug' }
      })
      .populate({
        path: 'wishlist.famousPlaces',
        select: 'name slug type images location city',
        populate: { path: 'city', select: 'name slug' }
      });

    res.status(200).json({ success: true, data: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle item in wishlist
// @route   POST /api/users/wishlist
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const { itemId, itemType } = req.body;
    // itemType should be 'places' or 'famousPlaces'

    if (!itemId || !itemType) {
      return res.status(400).json({ success: false, error: 'Please provide itemId and itemType' });
    }

    if (itemType !== 'places' && itemType !== 'famousPlaces') {
      return res.status(400).json({ success: false, error: 'Invalid itemType' });
    }

    const user = await User.findById(req.user.id);
    const wishlistArray = user.wishlist[itemType];

    const index = wishlistArray.indexOf(itemId);
    
    if (index === -1) {
      // Not in wishlist, add it
      wishlistArray.push(itemId);
    } else {
      // In wishlist, remove it
      wishlistArray.splice(index, 1);
    }

    await user.save();

    res.status(200).json({ 
      success: true, 
      message: index === -1 ? 'Added to wishlist' : 'Removed from wishlist',
      data: user.wishlist 
    });
  } catch (error) {
    next(error);
  }
};
