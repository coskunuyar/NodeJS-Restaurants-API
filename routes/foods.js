
const express = require('express');
const { getFoods ,getFood,addFood,updateFood, deleteFood } = require('../controllers/foods');

const router = express.Router({ mergeParams: true });

const Food = require('../models/Food');
const advancedResults = require('../middleware/advancedResults');
const { protect , authorize } = require('../middleware/auth');

router
  .route('/')
  .get(advancedResults(Food, {
    path: 'restaurants',
    select: 'name description'
  }),getFoods)
  .post(protect,authorize('owner','admin'),addFood);

router
  .route('/:id')
  .get(getFood)
  .put(protect,authorize('owner','admin'),updateFood)
  .delete(protect,authorize('owner','admin'),deleteFood);

module.exports = router;