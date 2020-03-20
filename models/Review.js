const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true , 'Please add title.'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true,'Please add text.']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true,'Please add rating.']
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    restaurant:{
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required: true
    }
});

ReviewSchema.index({restaurant: 1, user: 1} , { unique: true});

ReviewSchema.statics.getAverageRating = async function(restaurantId){
    const obj = await this.aggregate([
        {
          $match: { restaurant: restaurantId }
        },
        {
          $group: {
            _id: '$restaurant',
            averageRating: { $avg: '$rating' }
          }
        }
      ]);

      try{
        await this.model('Restaurant').findByIdAndUpdate(restaurantId, { averageRating: obj[0].averageRating });
      }catch(err){
        console.log(err);
      }
}

ReviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.restaurant);
});

ReviewSchema.pre('remove', function() {
    this.constructor.getAverageRating(this.restaurant);
});

module.exports = mongoose.model('Review',ReviewSchema);