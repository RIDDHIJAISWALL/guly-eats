import mongoose from 'mongoose';
import slugify from 'slugify';
import Food from '../models/Food.js';
import { foods as seedFoods } from '../../seed/data/foods.js';

const fallbackFoods = seedFoods.map((f, idx) => ({
  _id: `food-seed-${idx + 1}`,
  ...f,
  slug: f.slug || slugify(f.name, { lower: true }),
}));

// @desc    Get all foods
// @route   GET /api/foods
// @access  Public
export const getFoods = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: fallbackFoods.length,
        data: fallbackFoods,
      });
    }

    const foods = await Food.find().sort('name');

    if (!foods || foods.length === 0) {
      return res.status(200).json({
        success: true,
        count: fallbackFoods.length,
        data: fallbackFoods,
      });
    }

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      count: fallbackFoods.length,
      data: fallbackFoods,
    });
  }
};

// @desc    Get food by slug
// @route   GET /api/foods/:slug
// @access  Public
export const getFoodBySlug = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const food = fallbackFoods.find((f) => f.slug === req.params.slug);
      if (!food) {
        return res.status(404).json({
          success: false,
          error: 'Food not found',
        });
      }
      return res.status(200).json({
        success: true,
        data: {
          ...food,
          places: [],
        },
      });
    }

    const food = await Food.findOne({ slug: req.params.slug }).lean();

    if (!food) {
      const fallbackFood = fallbackFoods.find((f) => f.slug === req.params.slug);
      if (fallbackFood) {
        return res.status(200).json({
          success: true,
          data: {
            ...fallbackFood,
            places: [],
          },
        });
      }
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
    const fallbackFood = fallbackFoods.find((f) => f.slug === req.params.slug);
    if (fallbackFood) {
      return res.status(200).json({
        success: true,
        data: {
          ...fallbackFood,
          places: [],
        },
      });
    }
    next(error);
  }
};
