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
const foodRouter = require('./foods');

const router = express.Router();

router
  .route('/radius/:zipcode/:distance')
  .get(getRestaurantsInRadius);

router
  .route('/:id/photo')
  .put(restaurantPhotoUpload);

router
  .route('/')
  .get(getRestaurants)
  .post(createRestaurant);

router
  .route('/:id')
  .get(getRestaurant)
  .put(updateRestaurant)
  .delete(deleteRestaurant);

router.use('/:restaurantId/foods', foodRouter);


module.exports = router;