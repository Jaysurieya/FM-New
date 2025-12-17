import fs from "fs";
import path from "path";
import csv from "csv-parser";

const csvPath = path.join(process.cwd(), "data", "food_macros.csv");

// normalize food name (VERY important)
const normalize = (text) =>
  text.toLowerCase().trim().replace(/[-\s]/g, "_");

export const getFoodMacros = (foodName) => {
  return new Promise((resolve, reject) => {
    let result = null;
    const target = normalize(foodName);

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => {
        const csvFoodName = normalize(row["Food Item"]);

        if (csvFoodName === target) {
          result = {
            food: row["Food Item"],
            servingSize: row["Serving Size"],
            protein: Number(row["Proteins (g)"]),
            fats: Number(row["Fats (g)"]),
            carbs: Number(row["Carbs (g)"]),
            fibre: Number(row["Fibre (g)"]),
            calories: Number(row["Calories (kcal)"]),
          };
        }
      })
      .on("end", () => resolve(result))
      .on("error", reject);
  });
};
