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

const foodRouter = require('./foods');
const reviewRouter = require('./reviews');

const { protect , authorize} = require('../middleware/auth');

const router = express.Router();
const advancedResults = require('../middleware/advancedResults');

router
  .route('/radius/:zipcode/:distance')
  .get(getRestaurantsInRadius);

router
  .route('/:id/photo')
  .put(protect,restaurantPhotoUpload);

router
  .route('/')
  .get(advancedResults(Restaurant,'foods'),getRestaurants)
  .post(protect,authorize('owner','admin'),createRestaurant);

router
  .route('/:id')
  .get(getRestaurant)
  .put(protect,authorize('owner','admin'),updateRestaurant)
  .delete(protect,authorize('owner','admin'),deleteRestaurant);

router.use('/:restaurantId/foods', foodRouter);
router.use('/:restaurantId/reviews', reviewRouter);


module.exports = router;