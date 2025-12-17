import Daily from "./Daily";
import React, { useState, useEffect } from "react";

const overall = {
    backgroundColor: "#FFD5BD",
    height: "380px",
    border: "5px solid #492110",
    borderRadius: 20,
    display: "flex",
}

const daily = {
    // border: "4px solid #492110",
    height:"45%",
    width: "100%",
    margin: "8px",
}


function Food_Tracker({ nutrients,intake }) {

  const [todayIntake, setTodayIntake] = useState([]);

  // Sync today's intake from `intake` prop (array or single object)
  useEffect(() => {
    if (Array.isArray(intake)) {
      const normalized = intake.map((item) => ({
        ...item,
        Food: item?.Food ?? item?.food ?? "Food",
      }));
      setTodayIntake(normalized);
    } else if (intake && (intake.Food || intake.food)) {
      const foodName = intake.Food ?? intake.food;
      setTodayIntake((prev) => [...prev, { ...intake, Food: foodName }]);
    }
  }, [intake]);
  return (
    <div style={overall}>
        <div style={daily}>
            <h1 className="ml-2.5">Daily Goal:</h1>
            <div style={{
              margin: '10px',
              display: 'flex',
              flexDirection: 'row',
            }}>
              <Daily
                protein={nutrients.protein}
                fats={nutrients.fats}
                carbs={nutrients.carbs}
                fibre={nutrients.fibre}
                calories={nutrients.calories}
              />
            </div>
             <hr style={{ border: "none", height: 1.5, background: "#492110",margin: "0 auto",width:"97%"}} /> 
            <div style={{ paddingTop: "10px", marginLeft: "10px" }}>
              <h1>Today's Intake:</h1>

              <div
                style={{
                  maxHeight: "140px",   // adjust if you want more/less height
                  overflowY: "auto",
                  paddingRight: "6px"
                }}
              >
                {todayIntake.length === 0 && (
                  <p style={{ opacity: 0.6 }}>No food added yet</p>
                )}

                {todayIntake.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      marginTop: "8px",
                      padding: "8px",
                      background: "#FFE6D5",
                      borderRadius: 10,
                      border: "2px solid #492110",
                      width: "95%"
                    }}
                  >
                    <b>{item.Food || item.food || "Food"}</b>
                    <div style={{ fontSize: "14px" }}>
                      🥩 {item.protein}g | 🧈 {item.fats}g | 🍞 {item.carbs}g | 🌾 {item.fibre}g | 🔥 {item.calories} kcal
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
        <div>

        </div>
    </div>
  );
}

export default Food_Tracker;
