import Food from '../models/Food.js';

// @desc    Get all foods
// @route   GET /api/foods
// @access  Public
export const getFoods = async (req, res, next) => {
  try {
    const foods = await Food.find().sort('name');

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get food by slug
// @route   GET /api/foods/:slug
// @access  Public
export const getFoodBySlug = async (req, res, next) => {
  try {
    const food = await Food.findOne({ slug: req.params.slug }).lean();

    if (!food) {
      return res.status(404).json({
        success: false,
        error: 'Food not found',
      });
    }

    // Import Place to query
    const { default: Place } = await import('../models/Place.js');
    
    // Find places that have this food
    const places = await Place.find({ famousFoods: food._id })
      .populate('city', 'name slug')
      .sort('-averageRating')
      .lean();

    res.status(200).json({
      success: true,
      data: {
        ...food,
        places,
      },
    });
  } catch (error) {
    next(error);
  }
};
