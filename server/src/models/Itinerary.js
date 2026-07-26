import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add an itinerary name'],
      trim: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    city: {
      type: mongoose.Schema.ObjectId,
      ref: 'City',
      required: true,
    },
    stops: [
      {
        placeType: {
          type: String,
          enum: ['Place', 'FamousPlace'],
          required: true,
        },
        placeId: {
          type: mongoose.Schema.ObjectId,
          required: true,
          refPath: 'stops.placeType', // Dynamic reference based on placeType
        },
        order: {
          type: Number,
          default: 0,
        },
        notes: String,
      },
    ],
    date: Date,
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

itinerarySchema.index({ user: 1 });
itinerarySchema.index({ city: 1 });

export default mongoose.model('Itinerary', itinerarySchema);
