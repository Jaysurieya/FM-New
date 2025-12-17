const UserDetails = require('../Models/Details');

// Create or update details for authenticated user
const createUserDetails = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized: user not found in request' });
        }

        const {
            name,
            gender,
            location,
            weight,
            height,
            targetWeight,
            age,
            activityLevel,
            medicalDisabilities
        } = req.body;

        const update = {
            name,
            gender,
            location,
            weight,
            height,
            targetWeight,
            age,
            activityLevel,
            medicalDisabilities,
            user: req.user.id
        };

        const details = await UserDetails.findOneAndUpdate(
            { user: req.user.id },
            update,
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({ message: 'Details saved', details });
    } catch (error) {
        console.error('Error saving user details:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: error.errors });
        }
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Get profile details for authenticated user
const getProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const details = await UserDetails.findOne({ user: req.user.id });
        if (!details) {
            return res.status(404).json({ message: 'Details not found' });
        }
        res.json(details);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = {
    createUserDetails,
    getProfile,
};