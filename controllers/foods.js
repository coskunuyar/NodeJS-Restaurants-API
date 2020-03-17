const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Food = require('../models/Food');


// @desc      Get foods
// @route     GET /api/v1/foods
// @route     GET /api/v1/restaurants/:restaurantId/foods
// @access    Public
exports.getFoods = asyncHandler(async (req, res, next) => {
    let query;
  
    if (req.params.restaurantId) {
      query = Food.find({ restaurant: req.params.restaurantId });
    } else {
      query = Food.find().populate({
        path: 'restaurant',
        select: 'name description'
      });
    }
  
    const foods = await query;
  
    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods
    });
  });