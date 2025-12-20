const NutritionLog = require("../Models/Nutrition");

// helper → YYYY-MM-DD
const getTodayDate = () => new Date().toISOString().split("T")[0];

/**
 * GET today's water
 */
exports.getTodayWater = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = getTodayDate();

    const log = await NutritionLog.findOne({ user: userId, date });

    // no record today → water = 0
    if (!log) {
      return res.status(200).json({
        water: 0
      });
    }

    return res.status(200).json({
      water: log.water ?? 0
    });
  } catch (err) {
    console.error("Fetch water error:", err);
    res.status(500).json({ message: "Failed to fetch water" });
  }
};

/**
 * UPDATE water (+1 / -1)
 */
exports.updateWater = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = getTodayDate();
    const { amount } = req.body; // +1 or -1

    if (![1, -1].includes(amount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const log = await NutritionLog.findOneAndUpdate(
      { user: userId, date },
      {
        $inc: { water: amount },
        $setOnInsert: { date }
      },
      {
        new: true,
        upsert: true
      }
    );

    // 🛡️ prevent negative water
    if (log.water < 0) {
      log.water = 0;
      await log.save();
    }

    res.status(200).json({
      water: log.water
    });
  } catch (err) {
    console.error("Update water error:", err);
    res.status(500).json({ message: "Failed to update water" });
  }
};
