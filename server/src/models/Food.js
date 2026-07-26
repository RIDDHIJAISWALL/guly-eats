import mongoose from 'mongoose';
import slugify from 'slugify';

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a food name'],
      trim: true,
    },
    slug: String,
    description: String,
    image: String,
    tags: [String], // e.g., ['spicy', 'sweet', 'street food', 'breakfast']
    isVegetarian: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

foodSchema.pre('save', function (next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slugify(this.name, { lower: true });
  next();
});

export default mongoose.model('Food', foodSchema);
