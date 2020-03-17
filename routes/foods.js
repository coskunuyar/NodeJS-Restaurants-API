
const express = require('express');
const { getFoods } = require('../controllers/foods');

const router = express.Router({ mergeParams: true });

router.route('/').get(getFoods);

module.exports = router;