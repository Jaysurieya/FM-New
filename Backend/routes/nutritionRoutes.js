const express = require('express');
const router = express.Router();
const { getNutrition } = require('../controllers/nutritionController');
const { addNutrition } = require('../controllers/nutritionaddController');
const addMiddleware = require('../middleware/addMiddleware');
const fetchTDetailsController = require('../Controllers/dailyFetchController');

// Protected add endpoint (requires Bearer token)
router.post('/add', addMiddleware, addNutrition);
router.post('/fetch', getNutrition);
router.post('/fetch_T_details',addMiddleware, fetchTDetailsController.DailyFetch);
// Remove duplicate nested path; '/api/nutrition/add' is the intended route

module.exports = router;
