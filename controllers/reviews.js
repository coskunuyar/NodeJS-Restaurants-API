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


// @desc      Get single review
// @route     GET /api/v1/reviews/:id
// @access    Public
exports.getReview = asyncHandler(async(req,res,next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'restaurant',
        select: 'name description'
    });
    if(!review){
        return next(new ErrorResponse('No review found',404));
    }
    res.status(200).json({
        success: true,
        data: review
    })
});


// @desc      Add review
// @route     POST /api/v1/restaurants/:restaurantId/reviews
// @access    Private
exports.addReview = asyncHandler(async(req,res,next) => {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if(!restaurant){
        return next(new ErrorResponse('Restaurant not found!',404));
    }
    req.body.restaurant = req.params.restaurantId;
    req.body.user = req.user.id;
    
    const review = await Review.create(req.body);
    res.status(201).json({
        success: true,
        data: review
    });
});

// @desc      Update review
// @route     PUT /api/v1/reviews/:id
// @access    Private
exports.updateReview = asyncHandler(async(req,res,next) => {
    let review = await Review.findById(req.params.id);
    if(!review){
        return next(new ErrorResponse('Review not found !',404));
    }
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse('Not owner of the review',401));
    }
    review = await Review.findByIdAndUpdate(req.params.id,req.body,{ new: true, runValidators: true });
    res.status(200).json({ success: true, data: review});
});

// @desc      Delete review
// @route     DELETE /api/v1/reviews/:id
// @access    Private
exports.deleteReview = asyncHandler(async(req,res,next) => {
    let review = await Review.findById(req.params.id);
    if(!review){
        return next(new ErrorResponse('Review not found !',404));
    }
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse('Not owner of the review',401));
    }
    await review.remove();
    res.status(200).json({success: true });
});