const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const { postGeminiChat } = require("../Controllers/geminiController");

// add logout endpoint
router.post('/logout', authController.logout);


router.post("/google", authController.googleLogin);
router.post("/email-auth", authController.emailAuth);
router.post("/chat", postGeminiChat);


module.exports = router;