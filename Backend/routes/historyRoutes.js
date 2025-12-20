const express = require("express");
const router = express.Router();
const { getNutritionHistory } = require("../Controllers/historyController.js");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/fetch", authMiddleware, getNutritionHistory);

module.exports = router;
