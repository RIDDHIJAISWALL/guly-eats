import mongoose from 'mongoose';
import slugify from 'slugify';

const famousPlaceSchema = new mongoose.Schema(
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
      enum: ['monument', 'market', 'heritage', 'viewpoint', 'temple', 'park', 'museum', 'lake', 'garden'],
      required: true,
    },
    description: String,
    address: String,
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
    images: [String],
    thumbnail: String,
    entryFee: {
      type: Number,
      default: 0,
    },
    timings: {
      open: String,
      close: String,
    },
    timeRequired: String, // e.g., "2-3 hours"
  },
  {
    timestamps: true,
  }
);

famousPlaceSchema.index({ city: 1 });
famousPlaceSchema.index({ location: '2dsphere' });

famousPlaceSchema.pre('save', function (next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slugify(this.name, { lower: true });
  if (!this.thumbnail && this.images && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }
  next();
});

export default mongoose.model('FamousPlace', famousPlaceSchema);
