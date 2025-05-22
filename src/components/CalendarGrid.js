import React from 'react';
import { format, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO, startOfMonth, endOfMonth } from 'date-fns';

const CalendarGrid = ({ currentDate, selectedDate, onDateClick, events, overlappingEvents, checkEventOverlap }) => {
  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEEE';
    let startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
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

        const dayEvents = events.filter(event => {
          const eventDate = parseISO(event.date);
          return isSameDay(day, eventDate);
        });

        days.push(
          <div
            className={`col cell ${!isSameMonth(day, monthStart)
              ? 'disabled'
              : isSameDay(day, selectedDate)
                ? 'selected'
                : isSameDay(day, new Date())
                  ? 'today'
                  : ''
              }`}
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
