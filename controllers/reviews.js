const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');

// @desc      Get reviews
// @route     GET /api/v1/reviews
// @route     GET /api/v1/restaurants/:restaurantId/reviews
// @access    Public
exports.getReviews = asyncHandler(async(req,res,next) => {
    if(req.params.restaurantId){
        const reviews = await Review.find({restaurant: req.params.restaurantId});
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    }else{
        res.status(200).json(res.advancedResults);
    }
});