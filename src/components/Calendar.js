import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, isSameDay, parseISO } from 'date-fns';
import eventsData from '../static/events.json';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import SelectedDateEvents from './SelectedDateEvents';
import EventModal from './EventModal';
import '../static/css/calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState(new Set());

  const checkEventOverlap = (event, allEvents) => {
    const eventStart = new Date(`${event.date}T${event.startTime}`);
    const eventEnd = new Date(`${event.date}T${event.endTime}`);

    const overlappingEvents = allEvents.filter(otherEvent => {
      if (otherEvent.id === event.id) return false;

      const otherStart = new Date(`${otherEvent.date}T${otherEvent.startTime}`);
      const otherEnd = new Date(`${otherEvent.date}T${otherEvent.endTime}`);

      return (
        isSameDay(parseISO(event.date), parseISO(otherEvent.date)) &&
        ((eventStart < otherEnd && eventEnd > otherStart))
      );
    });

    return overlappingEvents;
  };

  useEffect(() => {
    setEvents(eventsData);
    filterEventsForSelectedDate(new Date());
  }, []);

  useEffect(() => {
    const overlaps = new Set();
    events.forEach(event => {
      const overlappingEventsForThis = checkEventOverlap(event, events);
      if (overlappingEventsForThis.length > 0) {
        overlaps.add(event.id);
        overlappingEventsForThis.forEach(oe => overlaps.add(oe.id));
      }
    });
    setOverlappingEvents(overlaps);
    filterEventsForSelectedDate(selectedDate);
  }, [selectedDate, events]);

  const filterEventsForSelectedDate = (date) => {
    const filteredEvents = events.filter(event => {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, date);
    });
    setSelectedDateEvents(filteredEvents);
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  const handleAddEvent = () => {
    setCurrentEvent({
      id: Date.now().toString(),
      title: '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '10:00',
      color: '#1a73e8'
    });
    setIsEditing(false);
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setCurrentEvent({
      ...event,
      date: format(parseISO(event.date), 'yyyy-MM-dd')
    });
    setIsEditing(true);
    setShowEventModal(true);
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    saveEventsToJson(updatedEvents);
  };

  const handleEventSubmit = (eventData) => {
    let updatedEvents;

    if (isEditing) {
      updatedEvents = events.map(event =>
        event.id === eventData.id ? eventData : event
      );
    } else {
      updatedEvents = [...events, eventData];
    }

    setEvents(updatedEvents);
    setShowEventModal(false);
    saveEventsToJson(updatedEvents);
  };

  const saveEventsToJson = (updatedEvents) => {
    console.log('Saving events:', updatedEvents);
  };

  return (
    <div className="calendar-container">
      <div className="calendar">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onToday={goToToday}
          onDateChange={handleDateChange}
        />
        <CalendarGrid
          currentDate={currentDate}
          selectedDate={selectedDate}
          onDateClick={onDateClick}
          events={events}
          overlappingEvents={overlappingEvents}
          checkEventOverlap={checkEventOverlap}
        />
      </div>
      
      <SelectedDateEvents
        selectedDate={selectedDate}
        selectedDateEvents={selectedDateEvents}
        overlappingEvents={overlappingEvents}
        checkEventOverlap={checkEventOverlap}
        handleEditEvent={handleEditEvent}
        handleDeleteEvent={handleDeleteEvent}
        handleAddEvent={handleAddEvent}
      />
      
      {showEventModal && (
        <EventModal
          event={currentEvent}
          isEditing={isEditing}
          onClose={() => setShowEventModal(false)}
          onSubmit={handleEventSubmit}
          isOverlapping={overlappingEvents.has(currentEvent?.id)}
          overlappingEvents={checkEventOverlap(currentEvent || {}, events)}
        />
      )}
    </div>
  );
};

export default Calendar;
