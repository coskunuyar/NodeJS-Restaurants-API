const express = require('express');
const {
    getRestaurants,
    getRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantsInRadius,
    restaurantPhotoUpload
} = require('../controllers/restaurants');


const Restaurant = require('../models/Restaurant');
const advancedResults = require('../middleware/advancedResults');

const foodRouter = require('./foods');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/radius/:zipcode/:distance')
  .get(getRestaurantsInRadius);

router
  .route('/:id/photo')
  .put(protect,restaurantPhotoUpload);

router
  .route('/')
  .get(advancedResults(Restaurant,'foods'),getRestaurants)
  .post(protect,createRestaurant);

router
  .route('/:id')
  .get(getRestaurant)
  .put(protect,updateRestaurant)
  .delete(protect,deleteRestaurant);

router.use('/:restaurantId/foods', foodRouter);


module.exports = router;