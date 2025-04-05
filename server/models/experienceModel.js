const mongoose = require('mongoose');

const experienceSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: 5000,
  },
  location: {
    city: {
      type: String,
      required: [true, 'Please add a city'],
    },
    country: {
      type: String,
      required: [true, 'Please add a country'],
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  images: [String],
  dateOfVisit: {
    startDate: Date,
    endDate: Date,
  },
  categories: [String],
  tips: [String],
  budget: {
    amount: Number,
    currency: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual populate comments
experienceSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'experience',
  justOne: false,
});

module.exports = mongoose.model('Experience', experienceSchema);
