import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please add a rating between 1 and 5'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a title for the review'],
      maxlength: 100,
    },
    text: {
      type: String,
      required: [true, 'Please add some text'],
    },
    images: [String],
    place: {
      type: mongoose.Schema.ObjectId,
      ref: 'Place',
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: true, // For demo purposes. In production, might want moderation
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one review per place
reviewSchema.index({ place: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
reviewSchema.statics.getAverageRating = async function (placeId) {
  const obj = await this.aggregate([
    {
      $match: { place: placeId, isApproved: true },
    },
    {
      $group: {
        _id: '$place',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    const Place = mongoose.model('Place');
    if (obj.length > 0) {
      await Place.findByIdAndUpdate(placeId, {
        averageRating: Math.round(obj[0].averageRating * 10) / 10,
        numReviews: obj[0].numReviews,
      });
    } else {
      await Place.findByIdAndUpdate(placeId, {
        averageRating: 0,
        numReviews: 0,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.place);
});

// Call getAverageRating after remove
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.getAverageRating(doc.place);
  }
});

export default mongoose.model('Review', reviewSchema);
