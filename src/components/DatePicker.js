import React, { useState } from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DatePicker = ({ currentDate, onDateSelect, onClose }) => {
  const [datePickerView, setDatePickerView] = useState('month');
  const [tempDate, setTempDate] = useState(currentDate);

  const handleMonthSelect = (monthIndex) => {
    const newDate = new Date(tempDate.getFullYear(), monthIndex, 1);
    onDateSelect(newDate);
  };

  const handleYearSelect = (year) => {
    const newDate = new Date(year, tempDate.getMonth(), 1);
    setTempDate(newDate);
    // Automatically go back to month view after year selection
    setDatePickerView('month');
  };

  const switchToYearView = () => {
    setDatePickerView('year');
  };

  const goToPreviousYear = () => {
    const newDate = new Date(tempDate.getFullYear() - 1, tempDate.getMonth(), 1);
    setTempDate(newDate);
  };

  const goToNextYear = () => {
    const newDate = new Date(tempDate.getFullYear() + 1, tempDate.getMonth(), 1);
    setTempDate(newDate);
  };

  return (
    <div className="date-picker-overlay" onClick={onClose}>
      <div className="date-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="date-picker-header">
          {datePickerView === 'month' ? (
            <>
              <div className="year-navigation">
                <button className="year-nav-btn" onClick={goToPreviousYear}>
                  <ChevronLeft size={16} />
                </button>
                <h4 onClick={switchToYearView} className="clickable-year">
                  {format(tempDate, 'yyyy')}
                </h4>
                <button className="year-nav-btn" onClick={goToNextYear}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          ) : (
            <h4>Select Year</h4>
          )}
          <button className="close-date-picker" onClick={onClose}>
            ×
          </button>
        </div>
        
        {datePickerView === 'month' ? (
          <MonthPicker 
            currentDate={tempDate}
            onMonthSelect={handleMonthSelect}
          />
        ) : (
          <YearPicker 
            currentDate={tempDate}
            onYearSelect={handleYearSelect}
          />
        )}
      </div>
    </div>
  );
};

const MonthPicker = ({ currentDate, onMonthSelect }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const currentMonth = currentDate.getMonth();
  
  return (
    <div className="month-picker-grid">
      {months.map((month, index) => (
        <div
          key={index}
          className={`month-item ${index === currentMonth ? 'selected' : ''}`}
          onClick={() => onMonthSelect(index)}
        >
          {month.substring(0, 3)}
        </div>
      ))}
    </div>
  );
};

const YearPicker = ({ currentDate, onYearSelect }) => {
  const currentYear = currentDate.getFullYear();
  const startYear = currentYear - 12;
  const endYear = currentYear + 12;
  
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  
  return (
    <div className="year-picker-container">
      <div className="year-picker-grid">
        {years.map((year) => (
          <div
            key={year}
            className={`year-item ${year === currentYear ? 'selected' : ''}`}
            onClick={() => onYearSelect(year)}
          >
            {year}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatePicker;
