import React, { useState } from 'react';
const CompactCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (day) => {
    return day === today.getDate() &&
           month === today.getMonth() &&
           year === today.getFullYear();
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '180px',
        fontSize: '10px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#fff',
        userSelect: 'none'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '4px',
          padding: '0 4px'
        }}>
          <button
            onClick={() => navigateMonth(-1)}
            style={{
              background: 'none', border: 'none', color: '#888',
              cursor: 'pointer', padding: '2px 6px', borderRadius: '3px',
              fontSize: '11px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#fff'}
            onMouseLeave={(e) => e.target.style.color = '#888'}
          >
            ‹
          </button>
          <div style={{
            fontSize: '11px',
            fontWeight: '500',
            color: '#fff'
          }}>
            {monthNames[month]} {year}
          </div>
          <button
            onClick={() => navigateMonth(1)}
            style={{
              background: 'none', border: 'none', color: '#888',
              cursor: 'pointer', padding: '2px 6px', borderRadius: '3px',
              fontSize: '11px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#fff'}
            onMouseLeave={(e) => e.target.style.color = '#888'}
          >
            ›
          </button>
        </div>
        
        {/* Day names */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1px',
          marginBottom: '2px'
        }}>
          {dayNames.map((day, index) => (
            <div
              key={index}
              style={{
                textAlign: 'center', padding: '2px',
                fontSize: '9px',
                color: '#666', fontWeight: '500'
              }}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1px'
        }}>
          {calendarDays.map((day, index) => (
            <div
              key={index}
              style={{
                minHeight: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: day ? 'pointer' : 'default',
                borderRadius: '3px',
                fontSize: '9px',
                fontWeight: isToday(day) ? '600' : '400',
                backgroundColor: isToday(day) ? 'rgba(132, 0, 255, 0.8)' : 'transparent',
                color: day ? (isToday(day) ? '#fff' : '#ccc') : 'transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (day && !isToday(day)) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (day && !isToday(day)) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#ccc';
                }
              }}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompactCalendar;