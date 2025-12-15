import React, { useState, useEffect } from "react";
import "@fontsource/alkatra";

function Progress({ calories }) {
  const CARD_WIDTH = 140;
  const CARD_HEIGHT = 140;

  const CIRCLE_SIZE = 140;
  const STROKE = 12;
  const MAX_COUNT = 1450;

  const [count, setCount] = useState(0);

  // ✅ update state safely when calories change
  useEffect(() => {
    if (typeof calories === "number") {
      setCount(Math.min(calories, MAX_COUNT));
    }
  }, [calories]);

  // ✅ clamp progress between 0 and 1
  const progress = Math.min(count / MAX_COUNT, 1);

  const radius = (CIRCLE_SIZE - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        background: "#FFD5BD",
        borderRadius: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Alkatra, sans-serif"
      }}
    >
      <div style={{ position: "relative", width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
        <svg
          width={CIRCLE_SIZE}
          height={CIRCLE_SIZE}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* background ring */}
          <circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={radius}
            stroke="#eee"
            strokeWidth={STROKE}
            fill="none"
          />

          {/* progress ring */}
          <circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={radius}
            stroke="#492110"
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 400ms ease" }}
          />
        </svg>

        {/* center content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 800,
            color: "#492110"
          }}
        >
          {count >= MAX_COUNT ? "Done" : count}
        </div>
      </div>
    </div>
  );
}

export default Progress;
