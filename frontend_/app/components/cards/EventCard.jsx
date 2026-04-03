import React from 'react';
import { Clock, MapPin, Users, AlertCircle, Calendar } from 'lucide-react';
import './EventCard.css';

export default function EventCard({ event, onApply, hasApplied }) {
  // Calculate progress percentage
  const progressPercentage = event.max_volunteers 
    ? (event.current_applications / event.max_volunteers) * 100 
    : 0;

  return (
    <div className="event-card">
     
      {event.is_urgent && (
        <div className="urgent-badge">
          <AlertCircle size={18} />
          <span>URGENT</span>
        </div>
      )}

      <div className="event-card-content">
       
        <div className="category-badge-container">
          <span className={`category-badge category-${event.category?.toLowerCase()}`}>
            {event.category}
          </span>
        </div>

        <h3 className="event-title">{event.title}</h3>

        <p className="event-description">{event.description}</p>

    
        <div className="event-info">
          <MapPin size={16} className="icon" />
          <span>{event.location}</span>
        </div>

      
        <div className="event-info">
          <Calendar size={16} className="icon" />
          <span>
            {new Date(event.event_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>

     
        <div className="event-info">
          <Clock size={16} className="icon" />
          <span>{event.event_time}</span>
        </div>

       
        <div className="volunteers-status">
          <div className="volunteers-info">
            <Users size={16} className="icon" />
            <span>{event.slot_status}</span>
            {event.slot_status === 'Almost Full' && (
              <span className="status-badge almost-full">Almost Full</span>
            )}
            {event.is_full && (
              <span className="status-badge full">Full</span>
            )}
          </div>

          {event.max_volunteers && !event.is_full && (
            <div className="progress-bar">
              <div 
                className={`progress-fill ${progressPercentage > 80 ? 'warning' : ''}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
        </div>

        {event.required_skills && event.required_skills.length > 0 && (
          <div className="skills-container">
            {event.required_skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        )}

     
        <button
          onClick={() => onApply(event.event_id)}
          disabled={event.is_full || hasApplied}
          className={`apply-button ${(event.is_full || hasApplied) ? 'disabled' : ''}`}
        >
          {hasApplied ? 'Applied' : event.is_full ? 'Event Full' : 'Apply Now'}
        </button>
      </div>
    </div>
  );
}