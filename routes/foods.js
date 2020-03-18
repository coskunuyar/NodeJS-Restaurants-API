
const express = require('express');
const { getFoods ,getFood,addFood,updateFood, deleteFood } = require('../controllers/foods');

const router = express.Router({ mergeParams: true });

const Food = require('../models/Food');
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(advancedResults(Food, {
    path: 'restaurants',
    select: 'name description'
  }),getFoods)
  .post(protect,addFood);

router
  .route('/:id')
  .get(getFood)
  .put(protect,updateFood)
  .delete(protect,deleteFood);

module.exports = router;