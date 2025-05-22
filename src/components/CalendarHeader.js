import React, { useState } from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DatePicker from './DatePicker';

const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth, onToday, onDateChange }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateSpanClick = () => {
    setShowDatePicker(true);
  };

  const handleDateSelect = (newDate) => {
    onDateChange(newDate);
    setShowDatePicker(false);
  };

  return (
    <div className="header row">
      <div className="col col-start">
        <div className="icon" onClick={onPrevMonth}>
          <ChevronLeft size={24} />
        </div>
      </div>
      <div className="col col-center">
        <span 
          className="date-selector" 
          onClick={handleDateSpanClick}
          title="Click to select month/year"
        >
          {format(currentDate, 'MMMM yyyy')}
        </span>
        <button className="today-button" onClick={onToday}>Today</button>
      </div>
      <div className="col col-end">
        <div className="icon" onClick={onNextMonth}>
          <ChevronRight size={24} />
        </div>
      </div>
      
      {showDatePicker && (
        <DatePicker
          currentDate={currentDate}
          onDateSelect={handleDateSelect}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
};

export default CalendarHeader;
