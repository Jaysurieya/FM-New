import React from "react";
import Progress from "./Progress_Bar";

function Daily({ protein, fats, carbs, fibre, calories }) {

  // ✅ max values per nutrition
//   const MAX_VALUES = {
//     Protein: 100,
//     Fats: 80,
//     Carbs: 300,
//     Fibre: 40
//   };
    const MAX_VALUES = {
    Protein: 1,
    Fats: 1,
    Carbs: 1,
    Fibre: 1
  };

  const data = [
    { label: "Protein", value: protein },
    { label: "Fats", value: fats },
    { label: "Carbs", value: carbs },
    { label: "Fibre", value: fibre }
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        gap: 24,
        alignItems: "center",
        justifyContent: "center",
        color: "#492110"
      }}
    >
      <Progress calories={calories} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          width: "100%"
        }}
      >
        {data.map((item) => {
          const max = MAX_VALUES[item.label];

          return (
            <div key={item.label}>
              {/* Label */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 500
                }}
              >
                <span>{item.label}:</span>
                <span>{item.value}g</span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  width: "100%",
                  height: 10,
                  borderRadius: 999,
                  background: "#e5e5e5",
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min((item.value / max) * 100, 100)}%`,
                    borderRadius: 999,
                    background: "currentColor",
                    transition: "width 0.3s ease"
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Daily;
