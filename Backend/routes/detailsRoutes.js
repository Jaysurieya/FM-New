const express = require('express');
const router = express.Router();
const detailsController = require('../Controllers/detailsController');
const auth = require('../middleware/authMiddleware');

// Create or update user details (authenticated)
router.post('/details_cu', auth, detailsController.createUserDetails);

// Fetch profile details for logged in user
router.get('/profile', auth, detailsController.getProfile);

module.exports = router;