import mongoose from 'mongoose';
import slugify from 'slugify';
import FamousPlace from '../models/FamousPlace.js';
import City from '../models/City.js';
import { famousPlaces as seedFamousPlaces } from '../../seed/data/famousPlaces.js';

const fallbackFamousPlaces = seedFamousPlaces.map((p, idx) => ({
  _id: `famous-seed-${idx + 1}`,
  ...p,
  slug: p.slug || slugify(p.name, { lower: true }),
  city: {
    _id: `city-${slugify(p.cityName || '', { lower: true })}`,
    name: p.cityName,
    slug: slugify(p.cityName || '', { lower: true }),
  },
}));

// @desc    Get all famous places (optionally filtered by city and type)
// @route   GET /api/famous-places
// @access  Public
export const getFamousPlaces = async (req, res, next) => {
  const getFallbackFiltered = () => {
    let filtered = fallbackFamousPlaces;
    if (req.query.city) {
      const cityFilter = req.query.city.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.city?.slug === cityFilter ||
          p.city?.name?.toLowerCase() === cityFilter ||
          p.city?._id === req.query.city
      );
    }
    if (req.query.type) {
      filtered = filtered.filter((p) => p.type === req.query.type);
    }
    return filtered;
  };

  try {
    if (mongoose.connection.readyState !== 1) {
      const filtered = getFallbackFiltered();
      return res.status(200).json({
        success: true,
        count: filtered.length,
        data: filtered,
      });
    }

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

    if (!famousPlaces || famousPlaces.length === 0) {
      const filtered = getFallbackFiltered();
      return res.status(200).json({
        success: true,
        count: filtered.length,
        data: filtered,
      });
    }

    res.status(200).json({
      success: true,
      count: famousPlaces.length,
      data: famousPlaces,
    });
  } catch (error) {
    const filtered = getFallbackFiltered();
    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  }
};

// @desc    Get single famous place by slug
// @route   GET /api/famous-places/:slug
// @access  Public
export const getFamousPlaceBySlug = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const famousPlace = fallbackFamousPlaces.find((p) => p.slug === req.params.slug);
      if (!famousPlace) {
        return res.status(404).json({
          success: false,
          error: 'Famous place not found',
        });
      }
      return res.status(200).json({
        success: true,
        data: famousPlace,
      });
    }

    const famousPlace = await FamousPlace.findOne({ slug: req.params.slug })
      .populate('city', 'name slug')
      .lean();

    if (!famousPlace) {
      const fallbackPlace = fallbackFamousPlaces.find((p) => p.slug === req.params.slug);
      if (fallbackPlace) {
        return res.status(200).json({
          success: true,
          data: fallbackPlace,
        });
      }
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
    const fallbackPlace = fallbackFamousPlaces.find((p) => p.slug === req.params.slug);
    if (fallbackPlace) {
      return res.status(200).json({
        success: true,
        data: fallbackPlace,
      });
    }
    next(error);
  }
};
