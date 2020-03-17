const Restaurant = require('../models/Restaurant');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// @desc      Get all restaurants
// @route     GET /api/v1/restaurants
// @access    Public
exports.getRestaurants = asyncHandler(async(req, res, next) => {
    let query;
    const reqQuery = {...req.query};
    const removeFields = ['select','sort','page','limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Restaurant.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

    // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Restaurant.countDocuments();
  
  query = query.skip(startIndex).limit(limit);

  const restaurants = await query;

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: restaurants.length,
    pagination,
    data: restaurants
  });
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