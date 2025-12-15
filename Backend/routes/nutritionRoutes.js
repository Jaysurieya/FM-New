const express = require('express');
const router = express.Router();
const { getNutrition } = require('../controllers/nutritionController');

router.post('/fetch', getNutrition);

module.exports = router;
