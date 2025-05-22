import React from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Plus } from 'lucide-react';

const SelectedDateEvents = ({ 
  selectedDate, 
  selectedDateEvents, 
  overlappingEvents, 
  checkEventOverlap, 
  handleEditEvent, 
  handleDeleteEvent,
  handleAddEvent 
}) => {
  return (
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
          {selectedDateEvents.map(event => {
            const isOverlapping = overlappingEvents.has(event.id);
            const overlappingEventsList = checkEventOverlap(event, selectedDateEvents);

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
                  <button className="edit-btn" onClick={() => handleEditEvent(event)}>
                    <Edit size={16} />
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteEvent(event.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SelectedDateEvents;
