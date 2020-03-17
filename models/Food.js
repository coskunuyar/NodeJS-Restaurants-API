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

FoodSchema.statics.getAverageCost = async function(restaurantId) {
  const obj = await this.aggregate([
    {
      $match: { restaurant: restaurantId }
    },
    {
      $group: {
        _id: '$restaurant',
        averageCost: { $avg: '$cost' } 
      }
    }
  ]);

  try {
    await this.model('Restaurant').findByIdAndUpdate(restaurantId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    });
  } catch (err) {
    console.error(err);
  }
};

FoodSchema.post('save', function() {
  this.constructor.getAverageCost(this.restaurant);
});

FoodSchema.pre('remove', function() {
  this.constructor.getAverageCost(this.restaurant);
});


module.exports = mongoose.model('Food', FoodSchema);