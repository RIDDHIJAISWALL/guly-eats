import Place from '../models/Place.js';

// @desc    Get places by city
// @route   GET /api/places?city=<cityId>
// @access  Public
export const getPlaces = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.city) query.city = req.query.city;
    if (req.query.famousFoods) query.famousFoods = req.query.famousFoods;

    const places = await Place.find(query)
      .populate('city', 'name slug')
      .populate('famousFoods', 'name slug')
      .sort('-averageRating')
      .lean();

    res.status(200).json({
      success: true,
      count: places.length,
      data: places,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single place by slug
// @route   GET /api/places/:slug
// @access  Public
export const getPlaceBySlug = async (req, res, next) => {
  try {
    const place = await Place.findOne({ slug: req.params.slug })
      .populate('city', 'name slug state')
      .populate('famousFoods', 'name slug description image')
      .lean();

    if (!place) {
      return res.status(404).json({
        success: false,
        error: 'Place not found',
      });
    }

    res.status(200).json({
      success: true,
      data: place,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby places
// @route   GET /api/places/nearby?lng=&lat=&maxDistance=
// @access  Public
export const getNearbyPlaces = async (req, res, next) => {
  try {
    const { lng, lat, maxDistance = 5000 } = req.query; // maxDistance in meters

    if (!lng || !lat) {
      return res.status(400).json({
        success: false,
        error: 'Please provide longitude and latitude',
      });
    }

    const places = await Place.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance),
        },
      },
    })
      .populate('city', 'name slug')
      .limit(20);

    res.status(200).json({
      success: true,
      count: places.length,
      data: places,
    });
  } catch (error) {
    next(error);
  }
};
