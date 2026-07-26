import Review from '../models/Review.js';
import Place from '../models/Place.js';

// @desc    Get reviews for a place
// @route   GET /api/reviews/:placeId
// @access  Public
export const getReviewsForPlace = async (req, res, next) => {
  try {
    const reviews = await Review.find({ place: req.params.placeId, isApproved: true })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .lean();

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a review
// @route   POST /api/reviews/:placeId
// @access  Private
export const addReview = async (req, res, next) => {
  try {
    req.body.place = req.params.placeId;
    req.body.user = req.user._id; // Ensure req.user._id is used if that's how auth middleware attaches it

    const place = await Place.findById(req.params.placeId);
    if (!place) {
      return res.status(404).json({
        success: false,
        error: 'Place not found',
      });
    }

    // Check if user already submitted a review
    const existingReview = await Review.findOne({
      place: req.params.placeId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this place',
      });
    }

    const review = await Review.create(req.body);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this place',
      });
    }
    next(error);
  }
};

// @desc    Get current user's reviews
// @route   GET /api/reviews/me
// @access  Private
export const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id || req.user.id })
      .populate('place', 'name slug city type images')
      .sort('-createdAt')
      .lean();

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    const userId = req.user._id || req.user.id;
    if (review.user.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
