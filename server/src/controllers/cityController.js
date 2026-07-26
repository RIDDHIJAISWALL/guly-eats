import City from '../models/City.js';
import Place from '../models/Place.js';
import FamousPlace from '../models/FamousPlace.js';

// @desc    Get all active cities
// @route   GET /api/cities
// @access  Public
export const getCities = async (req, res, next) => {
  try {
    const cities = await City.find({ isActive: true })
      .select('name slug state description coverImage images famousFor bestTimeToVisit location')
      .sort('name');

    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single city by slug
// @route   GET /api/cities/:slug
// @access  Public
export const getCityBySlug = async (req, res, next) => {
  try {
    const city = await City.findOne({ slug: req.params.slug, isActive: true })
      .populate('places')
      .populate('famousPlaces')
      .lean();

    if (!city) {
      return res.status(404).json({
        success: false,
        error: 'City not found',
      });
    }

    res.status(200).json({
      success: true,
      data: city,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured cities (for homepage)
// @route   GET /api/cities/featured
// @access  Public
export const getFeaturedCities = async (req, res, next) => {
  try {
    const cities = await City.find({ isActive: true })
      .select('name slug state description coverImage famousFor location')
      .sort('name')
      .limit(13);

    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    next(error);
  }
};
