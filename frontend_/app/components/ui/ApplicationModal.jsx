// 

import { useState } from 'react';
import { X, CheckCircle, User, MapPin, Calendar, Clock, Users, Sparkles, AlertCircle } from 'lucide-react';
import './ApplicationModal.css';

export default function ApplicationModal({ event, isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    gender: '',
    confirmApplication: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !event) return null;

  const handleSubmit = async () => {
    setError('');

    if (!formData.gender) {
      setError('Please select your gender');
      return;
    }
    
    if (!formData.confirmApplication) {
      setError('Please confirm your application');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(event.event_id, formData);
      
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({ gender: '', confirmApplication: false });
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ gender: '', confirmApplication: false });
      setError('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close-btn" 
          onClick={handleClose}
          disabled={isSubmitting}
        >
          <X size={24} />
        </button>

        <div className="modal-content">
          {showSuccess ? (
            <div className="success-animation">
              <div className="success-icon-wrapper">
                <CheckCircle size={80} className="success-icon" />
              </div>
              <h2 className="success-title">Application Submitted!</h2>
              <p className="success-message">We'll review your application soon.</p>
            </div>
          ) : (
            <>
              <div className="modal-header">
                <div className="sparkle-icon">
                  <Sparkles size={32} />
                </div>
                <h2 className="modal-title">Volunteer Application</h2>
                <p className="modal-subtitle">Join this amazing opportunity</p>
              </div>

              <div className="event-details-section">
                <h3 className="event-name">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                
                <div className="event-info-grid">
                  <div className="info-item">
                    <MapPin size={18} />
                    <span>{event.location}</span>
                  </div>
                  <div className="info-item">
                    <Calendar size={18} />
                    <span>
                      {new Date(event.event_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="info-item">
                    <Clock size={18} />
                    <span>{event.event_time}</span>
                  </div>
                  <div className="info-item">
                    <Users size={18} />
                    <span>{event.slot_status || `${event.available_slots || event.max_volunteers} slots left`}</span>
                  </div>
                </div>

                {event.required_skills && event.required_skills.length > 0 && (
                  <div className="skills-section">
                    <h4>Required Skills:</h4>
                    <div className="skills-tags">
                      {event.required_skills.map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="application-form">
                <div className="form-group">
                  <label className="form-label">
                    <User size={18} />
                    Gender
                  </label>
                  <div className="gender-options">
                    {['Male', 'Female', 'Other', 'Prefer not to say'].map((option) => (
                      <div 
                        key={option} 
                        className={`radio-label ${formData.gender === option ? 'selected' : ''}`}
                        onClick={() => setFormData({ ...formData, gender: option })}
                      >
                        <span className="radio-custom">
                          {formData.gender === option && <div className="radio-dot" />}
                        </span>
                        <span className="radio-text">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <div 
                    className={`checkbox-label ${formData.confirmApplication ? 'checked' : ''}`}
                    onClick={() => setFormData({ ...formData, confirmApplication: !formData.confirmApplication })}
                  >
                    <span className="checkbox-custom">
                      {formData.confirmApplication && <CheckCircle size={16} />}
                    </span>
                    <span className="checkbox-text">
                      I confirm my commitment to attend this event and fulfill my volunteer responsibilities
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <button 
                  onClick={handleSubmit}
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}