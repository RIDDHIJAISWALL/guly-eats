import mongoose from 'mongoose';
import slugify from 'slugify';

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a city name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    state: {
      type: String,
      required: [true, 'Please add the state'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    location: {
      // GeoJSON Point
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
    coverImage: {
      type: String,
      required: [true, 'Please add a cover image URL'],
    },
    images: [String],
    famousFor: [String], // e.g., ["Street Food", "Temples", "Ghats"]
    bestTimeToVisit: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create spatial index
citySchema.index({ location: '2dsphere' });

// Create slug from name before saving
citySchema.pre('save', function (next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Reverse populate with virtuals
citySchema.virtual('places', {
  ref: 'Place',
  localField: '_id',
  foreignField: 'city',
  justOne: false,
});

citySchema.virtual('famousPlaces', {
  ref: 'FamousPlace',
  localField: '_id',
  foreignField: 'city',
  justOne: false,
});

export default mongoose.model('City', citySchema);
