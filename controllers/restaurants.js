const Restaurant = require('../models/Restaurant');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// @desc      Get all restaurants
// @route     GET /api/v1/restaurants
// @access    Public
exports.getRestaurants = asyncHandler(async(req, res, next) => {
    const restaurants = await Restaurant.find();
    res.status(200).json({success: true , data: restaurants});
});

// @desc      Get all restaurants
// @route     GET /api/v1/restaurants/radius/:zipcode /:distance
// @access    Public
exports.getRestaurantsInRadius  = asyncHandler(async(req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  const radius = distance / 3963;
  
  const restaurants = await Restaurant.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });
  
  res.status(200).json({
    success: true,
    count: restaurants.length,
    data: restaurants
  });
});

  
// @desc      Get single restaurants
// @route     GET /api/v1/restaurants/:id
// @access    Public
exports.getRestaurant = asyncHandler(async (req, res, next) => {
      const restaurant = await Restaurant.findById(req.params.id);
      if(restaurant){
        res.status(200).json({success: true , data: restaurant});
      }else{
        next( new ErrorResponse(`Restaurant not found - id: ${req.params.id}`));
      }
});
  
// @desc      Create new restaurant
// @route     POST /api/v1/restaurants
// @access    Private
exports.createRestaurant = asyncHandler(async (req, res, next) => {
      const restaurant = await Restaurant.create(req.body);
        res.status(200).json({ success: true , data: restaurant});
});
  
// @desc      Update restaurant
// @route     PUT /api/v1/restaurants/:id
// @access    Private
exports.updateRestaurant = asyncHandler(async (req, res, next) => {
      const restaurant = await Restaurant.findByIdAndUpdate(req.params.id,req.body, {
        new: true,
        runValidators: true
      });
      if(restaurant){
        res.status(200).json({success: true , data: restaurant});
      }else{
        next(new ErrorResponse(`Restaurant not found - id: ${req.params.id}`));
      }
  });
  
// @desc      Delete restaurant
// @route     DELETE /api/v1/restaurants/:id
// @access    Private
exports.deleteRestaurant = asyncHandler(async (req, res, next) => {
      const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
      if(restaurant){
        res.status(200).json({ success: true });
      }else{
        next(new ErrorResponse(`Restaurant not found - id: ${req.params.id}`));
      }
  });