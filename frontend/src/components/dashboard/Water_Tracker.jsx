import { color } from "framer-motion";
import React, { useState } from "react";
import "@fontsource/alkatra";
import axios from "axios";
import { useEffect } from "react";


/**
 * RoundProgress
 * - count: number shown in center
 * - maxCount: how many + presses = 100%
 * - size & stroke to control scale
 *
 * Colors approximate the palette you provided.
 */
export default function Water_Tracker({
  initial = 0,
  maxCount = 15,
  size = 180,
  stroke = 10
}) {
  const [count, setCount] = useState(Math.max(0, Math.min(initial, maxCount)));
  const progress = Math.max(0, Math.min(1, count / maxCount)); // 0..1

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - progress);

  const wrapper = {
    
    display: "flex",
    alignItems: "center",
    gap: 15,
    userSelect: "none",
    fontFamily:"alkatra, sans-serif",
    justifyContent: "center",
    
  };
  const overall = {
    border: "5px solid #492110",
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFD5BD",
    width: "370px",
    height:"300px"
  }

  const btn = {
    width: 40,
    height: 40,
    borderRadius: 10,
    fontSize: 22,
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
    background: "#492110",
    color: "#FFCBAE"
  };

  const svgStyle = { transform: "rotate(-90deg)" }; // start at top

  const innerCircleSize = size - stroke * 2 - 12; // inner white hole

  const updateWaterDB = async (amount) => {
    try {
      const token = localStorage.getItem("fitmate_token");
      const res = await axios.post(
        "https://fm-new-2.onrender.com/api/nutrition/water",
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return res.data?.water;
    } catch (err) {
      console.error("Water update failed", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchTodayWater = async () => {
      try {
        const token = localStorage.getItem("fitmate_token");
        if (!token) return;

        // POST to protected endpoint that returns today's nutrition log
        const res = await axios.post(
          "https://fm-new-2.onrender.com/api/nutrition/fetch_T_details",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // if no record for today → water = 0
        if (!res.data?.data) {
          setCount(0);
          return;
        }

        const todayWater = res.data?.data?.water ?? 0;

        // clamp to maxCount just in case
        setCount(Math.min(todayWater, maxCount));
      } catch (err) {
        console.error("Failed to fetch water data", err);
      }
    };

    fetchTodayWater();
  }, [maxCount]);


  return (
    <div style={overall}>
      <h1 style={{fontFamily:"alkatra, sans-serif",paddingTop:"10px",fontSize:"25px",color:"#492110"}}>Water Tracker</h1>
      <br />
      <div style={wrapper}>
        <button
          aria-label="decrease"
          style={btn}
          onClick={() => {
              (async () => {
                const newWater = await updateWaterDB(-1);
                if (typeof newWater === 'number') {
                  setCount(Math.max(0, Math.min(maxCount, newWater)));
                }
              })();
            }}>
          −
        </button>

        <div style={{ position: "relative", width: size, height: size }}>
          <svg width={size} height={size} style={svgStyle}>
            <defs>  
              {/* multi-stop gradient that follows the palette image */}
              <linearGradient id="paletteGradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="100%" stopColor="#492110" />
              </linearGradient>

              {/* to give a soft shadow/glow to the progress ring */}
              <filter id="ringShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.08"/>
              </filter>
            </defs>

            {/* background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#ececec"
              strokeWidth={stroke}
              fill="none"
            />

            {/* progress ring using gradient stroke */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#paletteGradient)"
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              style={{ transition: "stroke-dashoffset 420ms cubic-bezier(.22,.9,.35,1)" }}
              filter="url(#ringShadow)"
            />
          </svg>

          {/* inner white circle to create donut */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: innerCircleSize,
              height: innerCircleSize,
              borderRadius: "50%",
              background: "#FFE8D6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)"
            }}
          >
            {/* Center content: number or Done */}
            <div style={{ textAlign: "center" }}>
              {count === maxCount ? (
                <div style={{ fontSize: 26, fontWeight: 800, color: "#492110" }}>
                  Done
                </div>
              ) : (
                <div style={{ fontSize: 32, fontWeight: 800, color: "#492110" }}>
                  {count}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          aria-label="increase"
          style={btn}
          onClick={() => {
              (async () => {
                const newWater = await updateWaterDB(1);
                if (typeof newWater === 'number') {
                  setCount(Math.max(0, Math.min(maxCount, newWater)));
                }
              })();
            }}>
          +
        </button>
      </div>
    </div>
  );
}
