import React, { useState } from "react";
import "./css/Calendar.css";
import "@fontsource/alkatra";

const Calendar = () => {
  const today = new Date();

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
    cells.push(
      <div key={d} className="day-cell">
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
