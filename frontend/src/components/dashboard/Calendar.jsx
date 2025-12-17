import React, { useState, useEffect } from "react";
import "./css/Calendar.css";
import "@fontsource/alkatra";

const Calendar = ({nutrients, maxValues}) => {
  const [isTodayStreak, setIsTodayStreak] = useState(false);
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0 = Jan

  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  });

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  // Empty cells before 1st day
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(<div key={`empty-${i}`} className="day-cell empty" />);
  }

  // Date cells
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday =
      d === todayDate &&
      month === todayMonth &&
      year === todayYear;
    const isStreakToday = isToday && isTodayStreak;
    cells.push(
      <div
        key={d}
        className={`day-cell ${isToday ? "today" : ""} ${isStreakToday ? "streak" : ""}`}
      >
        {d}
      </div>
    );
  }

  // Navigation Logic
  const nextMonth = () => {
    setMonth((prev) => (prev + 1) % 12);
    if (month === 11) setYear((prev) => prev + 1);
  };

  const prevMonth = () => {
    setMonth((prev) => (prev - 1 + 12) % 12);
    if (month === 0) setYear((prev) => prev - 1);
  };

  const nextYear = () => setYear(year + 1);
  const prevYear = () => setYear(year - 1);

  useEffect(() => {
    // Helper: coerce to number
    const toNumber = (v) => {
      const n = typeof v === 'string' ? parseFloat(v) : Number(v);
      return Number.isFinite(n) ? n : 0;
    };

    // Helper: normalize keys and values to a consistent shape
    const normalize = (obj = {}) => {
      const o = obj || {};
      const pn = toNumber(o.protein ?? o.Protein ?? o.PROTEIN);
      const fn = toNumber(o.fats ?? o.fat ?? o.Fats ?? o.FAT);
      const cn = toNumber(o.carbs ?? o.carb ?? o.Carbs ?? o.CARBS);
      const fb = toNumber(o.fibre ?? o.fiber ?? o.Fibre ?? o.FIBER);
      const kc = toNumber(o.calories ?? o.kcal ?? o.kcals ?? o.Calories);
      return { protein: pn, fats: fn, carbs: cn, fibre: fb, calories: kc };
    };

    if (!nutrients || !maxValues) {
      setIsTodayStreak(false);
      return;
    }

    const current = normalize(nutrients);
    const max = normalize(maxValues);

    // Only require keys that have a positive max target
    const requiredKeys = Object.keys(max).filter((k) => toNumber(max[k]) > 0);

    const allReached = requiredKeys.every((k) => toNumber(current[k]) >= toNumber(max[k]));
    setIsTodayStreak(allReached);
  }, [nutrients, maxValues]);

  return (
    <div className="calendar-wrapper">
      
      {/* Navigation Header */}
      <div className="calendar-header">
        <button onClick={prevYear} className="nav-btn">«</button>
        <button onClick={prevMonth} className="nav-btn">‹</button>

        <h2>{monthName} {year}</h2>

        <button onClick={nextMonth} className="nav-btn">›</button>
        <button onClick={nextYear} className="nav-btn">»</button>
      </div>

      <div className="week-row">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      <div className="calendar-grid">
        {cells}
      </div>
    </div>
  );
};

export default Calendar;
