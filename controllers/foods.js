const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant');


// @desc      Get foods
// @route     GET /api/v1/foods
// @route     GET /api/v1/restaurants/:restaurantId/foods
// @access    Public
exports.getFoods = asyncHandler(async (req, res, next) => {
    if (req.params.restaurantId) {
      const foods = await Food.find({ restaurant: req.params.restaurantId });
      return res.status(200).json({
        success: true,
        count: foods.length,
        data: foods
      });
    } else {
      res.status(200).json(res.advancedResults);
    }
  });


// @desc      Get single restaurant
// @route     GET /api/v1/restaurants/:id
// @access    Public
exports.getFood= asyncHandler(async (req, res, next) => {
  const food = await Food.findById(req.params.id).populate({
    path: 'restaurant',
    select: 'name description'
  });

  if (!food) {
    return next( new ErrorResponse(`No food with the id of ${req.params.id}`), 404);
  }

  res.status(200).json({ success: true, data: food });
});

// @desc      Add food
// @route     POST /api/v1/restaurants/:restaurantId/foods
// @access    Private
exports.addFood = asyncHandler(async (req, res, next) => {
  req.body.restaurant = req.params.restaurantId;
  req.body.user = req.user.id;

  const restaurant = await Restaurant.findById(req.params.restaurantId);

  if (!restaurant) {
    return next( new ErrorResponse(`No restaurant with the id of ${req.params.restaurantId}`), 404);
  }

  if(restaurant.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next( new ErrorResponse(`User ${req.user.id} is not owner`,401));
  }

  const food = await Food.create(req.body);

  res.status(200).json({
    success: true,
    data: food
  });
});


// @desc      Update food
// @route     PUT /api/v1/foods/:id
// @access    Private
exports.updateFood = asyncHandler(async (req, res, next) => {
  let food = await Food.findById(req.params.id);

  if (!food) {
    return next(
      new ErrorResponse(`No food with the id of ${req.params.id}`),
      404
    );
  }

  if(food.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next( new ErrorResponse(`User ${req.user.id} is not owner`,401));
  }

  food = await Food.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: food
  });
});


// @desc      Delete food
// @route     DELETE /api/v1/foods/:id
// @access    Private
exports.deleteFood = asyncHandler(async (req, res, next) => {
  const food = await Food.findById(req.params.id);

  if (!food) {
    return next( new ErrorResponse(`No food with the id of ${req.params.id}`),404);
  }

  if(food.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next( new ErrorResponse(`User ${req.user.id} is not owner`,401));
  }

  await food.remove();
  res.status(200).json({ success: true, data: {}});
});