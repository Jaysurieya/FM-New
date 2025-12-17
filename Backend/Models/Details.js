const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    name: { 
        type: String, 
        required: [true, 'Name is required.'] 
    },
    gender: { 
        type: String, 
        enum: ['male', 'female'],
        required: [true, 'Biological sex is required.']
    },
    location: { 
        type: String, 
        required: [true, 'Location is required.'] 
    },
    weight: { // Renamed from currentWeight
        type: Number, 
        required: [true, 'Current weight is required.'] 
    },
    height: { 
        type: Number, 
        required: [true, 'Height is required.'] 
    },
    targetWeight: { 
        type: Number, 
        required: [true, 'Target weight is required.'] 
    },
    age: { 
        type: Number, 
        required: [true, 'Age is required.'] 
    },
    activityLevel: { 
        type: String, 
        required: [true, 'Activity level is required.'] 
    },
    medicalDisabilities: { // Renamed from medicalInfo
        type: String, 
        default: '' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('UserDetails', userDetailsSchema);