
const express = require('express');
const { getFoods ,getFood,addFood,updateFood, deleteFood } = require('../controllers/foods');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getFoods)
  .post(addFood);

router
  .route('/:id')
  .get(getFood)
  .put(updateFood)
  .delete(deleteFood);

module.exports = router;