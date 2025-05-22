import React, { useState, useEffect } from 'react';
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';
import '../static/css/calendar.css';
import eventsData from '../static/events.json';
import EventModal from './EventModal';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedDateEvents, setSelectedDateEvents] = useState([]);
    const [showEventModal, setShowEventModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    //   state for overlapping events
    const [overlappingEvents, setOverlappingEvents] = useState(new Set());

    const checkEventOverlap = (event, allEvents) => {
        const eventStart = new Date(`${event.date}T${event.startTime}`);
        const eventEnd = new Date(`${event.date}T${event.endTime}`);

        //   function to detect overlapping events
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

    // Update the useEffect to detect overlaps
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

    // Load events from JSON file
    useEffect(() => {
        setEvents(eventsData);
        filterEventsForSelectedDate(new Date());
    }, []);

    // Filter events whenever selected date changes
    useEffect(() => {
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
            // Update existing event
            updatedEvents = events.map(event =>
                event.id === eventData.id ? eventData : event
            );
        } else {
            // Add new event
            updatedEvents = [...events, eventData];
        }

        setEvents(updatedEvents);
        setShowEventModal(false);
        saveEventsToJson(updatedEvents);
    };

    const saveEventsToJson = (updatedEvents) => {
        // In a real application, this would be an API call
        // For this example, we're just updating the state
        console.log('Saving events:', updatedEvents);
        // In a real app, you would make an API call here to save to the server
    };

    const renderHeader = () => {
        return (
            <div className="header row">
                <div className="col col-start">
                    <div className="icon" onClick={prevMonth}>
                        <ChevronLeft size={24} />
                    </div>
                </div>
                <div className="col col-center">
                    <span>{format(currentDate, 'MMMM yyyy')}</span>
                    <button className="today-button" onClick={goToToday}>Today</button>
                </div>
                <div className="col col-end">
                    <div className="icon" onClick={nextMonth}>
                        <ChevronRight size={24} />
                    </div>
                </div>
            </div>
        );
    };

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
        let formattedDate = '';

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const cloneDay = day;

                // Find events for this day
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
                            {dayEvents.map((event) => {
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
        <div className="calendar-container">
            <div className="calendar">
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </div>

            <div className="selected-date-events">
                <div className="events-header">
                    <h3>Events for {format(selectedDate, 'MMMM d, yyyy')}</h3>
                    <button className="add-event-btn" onClick={handleAddEvent}>
                        <Plus size={16} /> Add Event
                    </button>
                </div>

                {selectedDateEvents.length === 0 ? (
                    <p className="no-events">No events scheduled for this day.</p>
                ) : (
                    <div className="events-list">
                        {selectedDateEvents.map((event) => {
                            const isOverlapping = overlappingEvents.has(event.id);
                            const overlappingEventsList = checkEventOverlap(event, events);

                            return (
                                <div
                                    key={event.id}
                                    className={`event-item ${isOverlapping ? 'overlapping-event-item' : ''}`}
                                    style={{ borderLeft: `4px solid ${event.color}` }}
                                >
                                    <div className="event-details">
                                        <div className={`event-title ${isOverlapping ? 'overlapping-text' : ''}`}>
                                            {event.title}
                                            {isOverlapping && (
                                                <span className="overlap-indicator" title={`Overlaps with: ${overlappingEventsList.map(e => e.title).join(', ')}`}>
                                                    ⚠️
                                                </span>
                                            )}
                                        </div>
                                        <div className="event-time">
                                            {event.startTime} - {event.endTime}
                                        </div>
                                        {isOverlapping && (
                                            <div className="overlap-notification">
                                                Events overlapped with: {overlappingEventsList.map(e => e.title).join(', ')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="event-actions">
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEditEvent(event)}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteEvent(event.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

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
