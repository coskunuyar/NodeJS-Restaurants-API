const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  cost: {
    type: Number,
    required: [true, 'Please add a cost']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
    required: true
  }
});

module.exports = mongoose.model('Food', FoodSchema);