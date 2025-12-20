const NutritionLog = require("../Models/Nutrition");

exports.getNutritionHistory = async (req, res) => {
  try {
    const userId = req.user.id; // comes from auth middleware

    const logs = await NutritionLog.find({ user: userId })
      .sort({ date: -1 });

    return res.status(200).json({
      data: logs
    });
  } catch (error) {
    console.error("Fetch nutrition history error:", error);
    return res.status(500).json({
      message: "Failed to fetch history"
    });
  }
};
