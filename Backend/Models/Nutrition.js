const mongoose = require('mongoose');

const nutritionLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  date: {
    type: String, // YYYY-MM-DD
    required: true,
    index: true
  },

  protein: {
    type: Number,
    default: 0
  },

  fats: {
    type: Number,
    default: 0
  },

  carbs: {
    type: Number,
    default: 0
  },

  fibre: {
    type: Number,
    default: 0
  },

  calories: {
    type: Number,
    default: 0
  },

  water: {
    type: Number,
    default: 0 // glasses or count
  },

  foods: [
    {
      name: {
        type: String,
        required: true
      },
      protein: {
        type: Number,
        default: 0
      },
      fats: {
        type: Number,
        default: 0
      },
      carbs: {
        type: Number,
        default: 0
      },
      fibre: {
        type: Number,
        default: 0
      },
      calories: {
        type: Number,
        default: 0
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Ensure ONE document per user per day
 */
nutritionLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('NutritionLog', nutritionLogSchema);
