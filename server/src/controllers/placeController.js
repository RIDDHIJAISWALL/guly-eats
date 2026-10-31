import mongoose from 'mongoose';
import slugify from 'slugify';
import Place from '../models/Place.js';
import { places as seedPlaces } from '../../seed/data/places.js';

const fallbackPlaces = seedPlaces.map((p, idx) => ({
  _id: `place-seed-${idx + 1}`,
  ...p,
  slug: p.slug || slugify(p.name, { lower: true }),
  city: {
    _id: `city-${slugify(p.cityName || '', { lower: true })}`,
    name: p.cityName,
    slug: slugify(p.cityName || '', { lower: true }),
  },
  famousFoods: (p.foodNames || []).map((fn, fi) => ({
    _id: `food-${fi}`,
    name: fn,
    slug: slugify(fn, { lower: true }),
  })),
}));

// @desc    Get places by city
// @route   GET /api/places?city=<cityId>
// @access  Public
export const getPlaces = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      let filtered = fallbackPlaces;
      if (req.query.city) {
        const cityFilter = req.query.city.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.city?.slug === cityFilter ||
            p.city?.name?.toLowerCase() === cityFilter ||
            p.city?._id === req.query.city
        );
      }
      return res.status(200).json({
        success: true,
        count: filtered.length,
        data: filtered,
      });
    }

    const query = {};
    if (req.query.city) query.city = req.query.city;
    if (req.query.famousFoods) query.famousFoods = req.query.famousFoods;

    const places = await Place.find(query)
      .populate('city', 'name slug')
      .populate('famousFoods', 'name slug')
      .sort('-averageRating')
      .lean();

    if (!places || places.length === 0) {
      let filtered = fallbackPlaces;
      if (req.query.city) {
        const cityFilter = req.query.city.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.city?.slug === cityFilter ||
            p.city?.name?.toLowerCase() === cityFilter ||
            p.city?._id === req.query.city
        );
      }
      return res.status(200).json({
        success: true,
        count: filtered.length,
        data: filtered,
      });
    }

    res.status(200).json({
      success: true,
      count: places.length,
      data: places,
    });
  } catch (error) {
    let filtered = fallbackPlaces;
    if (req.query.city) {
      const cityFilter = req.query.city.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.city?.slug === cityFilter ||
          p.city?.name?.toLowerCase() === cityFilter ||
          p.city?._id === req.query.city
      );
    }
    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  }
};

// @desc    Get single place by slug
// @route   GET /api/places/:slug
// @access  Public
export const getPlaceBySlug = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const place = fallbackPlaces.find((p) => p.slug === req.params.slug);
      if (!place) {
        return res.status(404).json({
          success: false,
          error: 'Place not found',
        });
      }
      return res.status(200).json({
        success: true,
        data: place,
      });
    }

    const place = await Place.findOne({ slug: req.params.slug })
      .populate('city', 'name slug state')
      .populate('famousFoods', 'name slug description image')
      .lean();

    if (!place) {
      const fallbackPlace = fallbackPlaces.find((p) => p.slug === req.params.slug);
      if (fallbackPlace) {
        return res.status(200).json({
          success: true,
          data: fallbackPlace,
        });
      }
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
    const fallbackPlace = fallbackPlaces.find((p) => p.slug === req.params.slug);
    if (fallbackPlace) {
      return res.status(200).json({
        success: true,
        data: fallbackPlace,
      });
    }
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
