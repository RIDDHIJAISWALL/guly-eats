import Itinerary from '../models/Itinerary.js';

// @desc    Get all user itineraries
// @route   GET /api/itineraries
// @access  Private
export const getMyItineraries = async (req, res, next) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user.id })
      .populate('city', 'name slug')
      .populate('stops.placeId', 'name slug images location')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: itineraries.length, data: itineraries });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new itinerary
// @route   POST /api/itineraries
// @access  Private
export const createItinerary = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    const itinerary = await Itinerary.create(req.body);

    res.status(201).json({ success: true, data: itinerary });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete itinerary
// @route   DELETE /api/itineraries/:id
// @access  Private
export const deleteItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ success: false, error: 'Itinerary not found' });
    }

    if (itinerary.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this itinerary' });
    }

    await itinerary.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
