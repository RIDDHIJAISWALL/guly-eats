import mongoose from 'mongoose';
import slugify from 'slugify';

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a place name'],
      trim: true,
    },
    slug: String,
    city: {
      type: mongoose.Schema.ObjectId,
      ref: 'City',
      required: true,
    },
    type: {
      type: String,
      enum: ['food_shop', 'restaurant', 'street_stall', 'cafe', 'sweet_shop', 'bakery'],
      required: true,
    },
    description: String,
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    images: {
      type: [String],
      required: [true, 'Please add at least one image'],
    },
    thumbnail: String, // Specifically for map marker DivIcon
    timings: {
      open: String, // e.g., "10:00 AM"
      close: String,
    },
    budget: {
      type: String,
      enum: ['low', 'medium', 'high', 'premium'],
      required: true,
    },
    isVegetarian: { type: Boolean, default: false },
    isHalal: { type: Boolean, default: false },
    isFamilyFriendly: { type: Boolean, default: true },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    cuisines: [String],
    famousFoods: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Food'
    }],
    facilities: [{
      type: String,
      enum: ['parking', 'washroom', 'seating', 'ac', 'wifi']
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for fast searching and geospatial queries
placeSchema.index({ city: 1 });
placeSchema.index({ location: '2dsphere' });
placeSchema.index({ type: 1 });
placeSchema.index({ budget: 1 });

placeSchema.pre('save', function (next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slugify(this.name, { lower: true });
  // Ensure a thumbnail exists if images are provided
  if (!this.thumbnail && this.images && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }
  next();
});

// Virtual for reviews
placeSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'place',
  justOne: false,
});

export default mongoose.model('Place', placeSchema);
