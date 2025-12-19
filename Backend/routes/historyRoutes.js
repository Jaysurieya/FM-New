const express = require("express");
const router = express.Router();
const { getNutritionHistory } = require("../controllers/historyController.js");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/fetch", authMiddleware, getNutritionHistory);

module.exports = router;
