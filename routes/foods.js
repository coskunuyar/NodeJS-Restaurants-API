
const express = require('express');
const { getFoods ,getFood,addFood,updateFood, deleteFood } = require('../controllers/foods');

const router = express.Router({ mergeParams: true });

const Food = require('../models/Food');
const advancedResults = require('../middleware/advancedResults');

router
  .route('/')
  .get(advancedResults(Food, {
    path: 'restaurants',
    select: 'name description'
  }),getFoods)
  .post(addFood);

router
  .route('/:id')
  .get(getFood)
  .put(updateFood)
  .delete(deleteFood);

module.exports = router;