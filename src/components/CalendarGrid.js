import React from 'react';
import { format, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO, startOfMonth, endOfMonth } from 'date-fns';

const CalendarGrid = ({ currentDate, selectedDate, onDateClick, events, overlappingEvents, checkEventOverlap }) => {
  const renderDays = () => {
  const days = [];
  const dateFormat = 'EEEE';
  const shortDateFormat = 'EEE'; // Short format for mobile
  const veryShortDateFormat = 'EEEEE'; // Single letter for very small screens
  
  let startDate = startOfWeek(currentDate);

  for (let i = 0; i < 7; i++) {
    const dayDate = addDays(startDate, i);
    days.push(
      <div className="col col-center day-header" key={i}>
        <span className="day-full">{format(dayDate, dateFormat)}</span>
        <span className="day-short">{format(dayDate, shortDateFormat)}</span>
        <span className="day-letter">{format(dayDate, veryShortDateFormat)}</span>
      </div>
    );
  }

  return <div className="days row">{days}</div>;
};


  const renderCells = () => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, 'd');
      const cloneDay = day;
      const isToday = isSameDay(day, new Date());
      const isSelected = isSameDay(day, selectedDate);
      const isCurrentMonth = isSameMonth(day, monthStart);

      const dayEvents = events.filter(event => {
        const eventDate = parseISO(event.date);
        return isSameDay(day, eventDate);
      });

      // Build class names with proper priority
      let cellClasses = 'col cell';
      
      if (!isCurrentMonth) {
        cellClasses += ' disabled';
      } else {
        if (isToday) {
          cellClasses += ' today';
        }
        if (isSelected) {
          cellClasses += ' selected';
        }
      }

      days.push(
        <div
          className={cellClasses}
          key={day}
          onClick={() => onDateClick(cloneDay)}
        >
          <span className="number">{formattedDate}</span>
          <div className="events-container">
            {dayEvents.map(event => {
              const isOverlapping = overlappingEvents.has(event.id);
              const overlappingEventsList = checkEventOverlap(event, events);

              return (
                <div
                  key={event.id}
                  className={`event ${isOverlapping ? 'overlapping-event' : ''}`}
                  style={{ backgroundColor: event.color }}
                  title={isOverlapping ?
                    `${event.title} (${event.startTime} - ${event.endTime}) - OVERLAPS WITH: ${overlappingEventsList.map(e => e.title).join(', ')}` :
                    `${event.title} (${event.startTime} - ${event.endTime})`
                  }
                >
                  {event.title}
                </div>
              );
            })}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }

    rows.push(
      <div className="row" key={day}>
        {days}
      </div>
    );
    days = [];
  }

  return <div className="body">{rows}</div>;
};


  return (
    <>
      {renderDays()}
      {renderCells()}
    </>
  );
};

export default CalendarGrid;
