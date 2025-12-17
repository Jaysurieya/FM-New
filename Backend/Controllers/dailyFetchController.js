const NutritionLog = require("../models/Nutrition");

// helper to get local YYYY-MM-DD (not UTC)
const getTodayDate = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

exports.DailyFetch = async (req, res) => {
  try {
    // 🔐 auth middleware already ran
    const userId = req.user.id;
    const date = getTodayDate();

    const nutritionLog = await NutritionLog.findOne({
      user: userId,
      date
    });

    // If no record for today, return null (frontend will reset)
    if (!nutritionLog) {
      return res.status(200).json({ data: null });
    }

    return res.status(200).json({
      data: nutritionLog
    });

  } catch (error) {
    console.error("Fetch nutrition error:", error);
    return res.status(500).json({
      message: "Failed to fetch nutrition details"
    });
  }
};
