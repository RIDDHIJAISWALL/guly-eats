import FamousPlace from '../models/FamousPlace.js';
import City from '../models/City.js';

// @desc    Get all famous places (optionally filtered by city and type)
// @route   GET /api/famous-places
// @access  Public
export const getFamousPlaces = async (req, res, next) => {
  try {
    const query = {};
    
    // Filter by city (supports both ID and slug)
    if (req.query.city) {
      if (/^[0-9a-fA-F]{24}$/.test(req.query.city)) {
        query.city = req.query.city;
      } else {
        const city = await City.findOne({ slug: req.query.city });
        if (city) {
          query.city = city._id;
        } else {
          return res.status(200).json({
            success: true,
            count: 0,
            data: [],
          });
        }
      }
    }

    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }

    const famousPlaces = await FamousPlace.find(query)
      .populate('city', 'name slug')
      .sort('name')
      .lean();

    res.status(200).json({
      success: true,
      count: famousPlaces.length,
      data: famousPlaces,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single famous place by slug
// @route   GET /api/famous-places/:slug
// @access  Public
export const getFamousPlaceBySlug = async (req, res, next) => {
  try {
    const famousPlace = await FamousPlace.findOne({ slug: req.params.slug })
      .populate('city', 'name slug')
      .lean();

    if (!famousPlace) {
      return res.status(404).json({
        success: false,
        error: 'Famous place not found',
      });
    }

    res.status(200).json({
      success: true,
      data: famousPlace,
    });
  } catch (error) {
    next(error);
  }
};
