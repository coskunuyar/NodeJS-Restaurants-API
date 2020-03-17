const Restaurant = require('../models/Restaurant');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const path = require('path');

// @desc      Get all restaurants
// @route     GET /api/v1/restaurants
// @access    Public
exports.getRestaurants = asyncHandler(async(req, res, next) => {
  res.status(200).json(res.advancedResults);
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
      const restaurant = await Restaurant.findById(req.params.id);
      if(restaurant){
        restaurant.remove();
        res.status(200).json({ success: true });
      }else{
        next(new ErrorResponse(`Restaurant not found - id: ${req.params.id}`));
      }
});



// @desc      Upload photo for restaurant
// @route     PUT /api/v1/restaurants/:id/photo
// @access    Private
exports.restaurantPhotoUpload = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    return next(
      new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  file.name = `photo_${restaurant._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Restaurant.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});
