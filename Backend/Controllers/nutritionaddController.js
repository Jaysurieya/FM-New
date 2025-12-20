const NutritionLog = require('../Models/Nutrition');

// helper to get local YYYY-MM-DD (not UTC)
const getTodayDate = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

exports.addNutrition = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
          return res.status(401).json({ message: "Unauthorized" });
        }

    const userId = req.user.id; // from auth middleware
    const date = getTodayDate();

    const {
      name,
      protein = 0,
      fats = 0,
      carbs = 0,
      fibre = 0,
      calories = 0
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Food name is required' });
    }

    // find today's log
    let nutritionLog = await NutritionLog.findOne({ user: userId, date });

    const foodEntry = {
      name,
      protein,
      fats,
      carbs,
      fibre,
      calories
    };

    if (!nutritionLog) {
      // first entry of the day → create new document
      nutritionLog = new NutritionLog({
        user: userId,
        date,
        protein,
        fats,
        carbs,
        fibre,
        calories,
        foods: [foodEntry]
      });
    } else {
      // update existing document
      nutritionLog.protein += protein;
      nutritionLog.fats += fats;
      nutritionLog.carbs += carbs;
      nutritionLog.fibre += fibre;
      nutritionLog.calories += calories;
      nutritionLog.foods.push(foodEntry);
    }

    await nutritionLog.save();

    res.status(200).json({
      message: 'Nutrition added successfully',
      data: nutritionLog
    });

  } catch (error) {
    console.error('Add nutrition error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
