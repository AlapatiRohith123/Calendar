import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../static/css/eventmodal.css';

const EventModal = ({ event, isEditing, onClose, onSubmit, isOverlapping, overlappingEvents }) => {
  const [eventData, setEventData] = useState({
    id: '',
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    color: '#1a73e8'
  });
  
  useEffect(() => {
    if (event) {
      setEventData(event);
    }
  }, [event]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!eventData.title || !eventData.date || !eventData.startTime || !eventData.endTime) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Format the date properly for storage
    const formattedEvent = {
      ...eventData,
      date: eventData.date // Make sure date is in yyyy-MM-dd format
    };
    
    onSubmit(formattedEvent);
  };
  
  return (
    <div className="modal-overlay">
      
      <div className={`event-modal ${isOverlapping ? 'overlapping-modal' : ''}`}>
        <div className="modal-header">
          <h3>{isEditing ? 'Edit Event' : 'Add New Event'}</h3>
          {isOverlapping && (
            <div className="overlap-warning">
              <span className="overlap-icon">⚠️</span>
              <span>Event Overlapped</span>
            </div>
          )}
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        {isOverlapping && (
          <div className="overlap-notification-modal">
            <strong>This event overlaps with:</strong>
            <ul>
              {overlappingEvents.map((oe, idx) => (
                <li key={idx}>{oe.title} ({oe.startTime} - {oe.endTime})</li>
              ))}
            </ul>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={eventData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={eventData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="color">Event Color</label>
            <input
              type="color"
              id="color"
              name="color"
              value={eventData.color}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {isEditing ? 'Update Event' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
