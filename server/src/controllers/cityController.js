import mongoose from 'mongoose';
import slugify from 'slugify';
import City from '../models/City.js';
import Place from '../models/Place.js';
import FamousPlace from '../models/FamousPlace.js';
import { cities as seedCities } from '../../seed/data/cities.js';

// Pre-computed fallback cities from seed data
const fallbackCities = seedCities.map((city, idx) => ({
  _id: `city-seed-${idx + 1}`,
  ...city,
  slug: slugify(city.name, { lower: true }),
  tagline: city.famousFor?.slice(0, 2).join(' • ') || 'Explore City',
}));

// @desc    Get all active cities
// @route   GET /api/cities
// @access  Public
export const getCities = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: fallbackCities.length,
        data: fallbackCities,
      });
    }

    const cities = await City.find({ isActive: true })
      .select('name slug state description coverImage images famousFor bestTimeToVisit location')
      .sort('name');

    if (!cities || cities.length === 0) {
      return res.status(200).json({
        success: true,
        count: fallbackCities.length,
        data: fallbackCities,
      });
    }

    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    // If DB is disconnected or query fails, respond with fallback immediately
    res.status(200).json({
      success: true,
      count: fallbackCities.length,
      data: fallbackCities,
    });
  }
};

// @desc    Get single city by slug
// @route   GET /api/cities/:slug
// @access  Public
export const getCityBySlug = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const city = fallbackCities.find((c) => c.slug === req.params.slug);
      if (!city) {
        return res.status(404).json({
          success: false,
          error: 'City not found',
        });
      }
      return res.status(200).json({
        success: true,
        data: city,
      });
    }

    const city = await City.findOne({ slug: req.params.slug, isActive: true })
      .populate('places')
      .populate('famousPlaces')
      .lean();

    if (!city) {
      const fallbackCity = fallbackCities.find((c) => c.slug === req.params.slug);
      if (fallbackCity) {
        return res.status(200).json({
          success: true,
          data: fallbackCity,
        });
      }
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
    const fallbackCity = fallbackCities.find((c) => c.slug === req.params.slug);
    if (fallbackCity) {
      return res.status(200).json({
        success: true,
        data: fallbackCity,
      });
    }
    next(error);
  }
};

// @desc    Get featured cities (for homepage)
// @route   GET /api/cities/featured
// @access  Public
export const getFeaturedCities = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const featured = fallbackCities.slice(0, 13);
      return res.status(200).json({
        success: true,
        count: featured.length,
        data: featured,
      });
    }

    const cities = await City.find({ isActive: true })
      .select('name slug state description coverImage famousFor location')
      .sort('name')
      .limit(13);

    if (!cities || cities.length === 0) {
      const featured = fallbackCities.slice(0, 13);
      return res.status(200).json({
        success: true,
        count: featured.length,
        data: featured,
      });
    }

    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    const featured = fallbackCities.slice(0, 13);
    res.status(200).json({
      success: true,
      count: featured.length,
      data: featured,
    });
  }
};

// @desc    Create a city
// @route   POST /api/cities
// @access  Private/Admin
export const createCity = async (req, res, next) => {
  try {
    if (!req.body.slug && req.body.name) {
      req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    const city = await City.create(req.body);
    res.status(201).json({ success: true, data: city });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a city
// @route   PUT /api/cities/:id
// @access  Private/Admin
export const updateCity = async (req, res, next) => {
  try {
    if (req.body.name && !req.body.slug) {
      req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    const city = await City.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!city) {
      return res.status(404).json({ success: false, error: 'City not found' });
    }
    res.status(200).json({ success: true, data: city });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a city
// @route   DELETE /api/cities/:id
// @access  Private/Admin
export const deleteCity = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ success: false, error: 'City not found' });
    }
    await city.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
