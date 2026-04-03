
'use client';
import { useEffect, useState } from 'react';
import './page.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_events: 0,
    total_applicants: 47,
    approved: 37,
    attended: 8
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    category: '',
    max_volunteers: '',
    required_skills: ''
  });

  useEffect(() => {
    fetchStats();
    fetchEvents();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('http://127.0.0.1:5000/api/events/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(prev => ({ ...prev, total_events: data?.length || 0 }));
      } else {
        console.error('Failed to fetch stats:', response.status);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      const response = await fetch('http://127.0.0.1:5000/api/events/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data || []);
      } else {
        console.error('Failed to fetch events:', response.status);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');

    console.log(' Token check:', {
      exists: !!token,
      length: token?.length,
      preview: token?.substring(0, 20) + '...'
    });

    if (!token) {
      showNotification('Please login to continue', 'error');
      return;
    }

    console.log('Submitting form data:', formData);

    try {
      const url = editingEvent
        ? `http://127.0.0.1:5000/api/events/${editingEvent.event_id}`
        : 'http://127.0.0.1:5000/api/events/';

      // Keep required_skills as string (backend expects string, not array)
      const payload = {
        ...formData,
        required_skills: formData.required_skills || '',
        max_volunteers: parseInt(formData.max_volunteers)
      };

      console.log('Sending payload:', payload);
      console.log(' Authorization header:', `Bearer ${token.substring(0, 20)}...`);

      const response = await fetch(url, {
        method: editingEvent ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('Success response:', result);
        
        // Show success animation
        setShowSuccessAnimation(true);
        
        // After 2 seconds, close modal and refresh
        setTimeout(() => {
          setShowSuccessAnimation(false);
          closeModal();
          fetchEvents();
          fetchStats();
          showNotification(
            editingEvent ? 'Event updated successfully!' : 'Event created successfully!', 
            'success'
          );
        }, 2000);
      } else {
        console.error('Response failed with status:', response.status);
        
        // Get the response text first to see what we're receiving
        const responseText = await response.text();
        console.error('Raw response:', responseText);
        
        let errorData = {};
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          console.error('Failed to parse error response as JSON');
        }
        
        console.error('Error response:', errorData);
        showNotification(errorData.error || errorData.message || 'Operation failed', 'error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      showNotification('Connection error: ' + error.message, 'error');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      event_time: event.event_time,
      location: event.location,
      category: event.category || '',
      max_volunteers: event.max_volunteers,
      required_skills: Array.isArray(event.required_skills) 
        ? event.required_skills.join(', ')
        : event.required_skills || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://127.0.0.1:5000/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        showNotification('Event deleted successfully!', 'success');
        fetchEvents();
        fetchStats();
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'Failed to delete event', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showNotification('Failed to delete event', 'error');
    }
  };

  const closeModal = () => {
    if (!showSuccessAnimation) {
      setShowModal(false);
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        event_date: '',
        event_time: '',
        location: '',
        category: '',
        max_volunteers: '',
        required_skills: ''
      });
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="admin-dashboard">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <p className="dashboard-subtitle">Monitor your volunteer management system</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Total Events</p>
              <h3 className="stat-value">{stats.total_events}</h3>
            </div>
            <div className="stat-icon blue">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Total Applicants</p>
              <h3 className="stat-value">{stats.total_applicants}</h3>
            </div>
            <div className="stat-icon purple">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Approved</p>
              <h3 className="stat-value">{stats.approved}</h3>
            </div>
            <div className="stat-icon green">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Attended</p>
              <h3 className="stat-value">{stats.attended}</h3>
            </div>
            <div className="stat-icon indigo">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="event-management">
        <div className="section-header">
          <div>
            <h2 className="section-title">Event Management</h2>
            <p className="section-subtitle">Create, edit, and manage volunteer events</p>
          </div>
          <button className="create-event-btn" onClick={() => setShowModal(true)}>
            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Event
          </button>
        </div>

        {loading ? (
          <div className="loading-events">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="placeholder-message">
            <svg className="placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="placeholder-text">No events yet. Click "Create Event" to add one!</p>
          </div>
        ) : (
          <div className="events-table">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Slots</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.event_id}>
                    <td>
                      <div className="event-info">
                        <p className="event-title">{event.title}</p>
                        <p className="event-category">{event.category}</p>
                      </div>
                    </td>
                    <td>
                      <div className="date-info">
                        <svg className="date-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {event.event_date}
                      </div>
                    </td>
                    <td>
                      <div className="location-info">
                        <svg className="location-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                    </td>
                    <td>0/{event.max_volunteers}</td>
                    <td>
                      <span className={`status-badge ${event.status}`}>{event.status}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn" onClick={() => handleEdit(event)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(event.event_id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {showSuccessAnimation ? (
              <div className="success-animation">
                <div className="success-icon-wrapper">
                  <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="success-title">
                  {editingEvent ? 'Event Updated!' : 'Event Created!'}
                </h2>
                <p className="success-message">
                  {editingEvent ? 'Your event has been updated successfully.' : 'Your event has been created successfully.'}
                </p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
                  <button className="close-btn" onClick={closeModal}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Event Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Bagmati Cleanup Campaign" />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder="Describe the event..." />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input type="date" name="event_date" value={formData.event_date} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="text" name="event_time" value={formData.event_time} onChange={handleInputChange} placeholder="09:00 AM - 12:00 PM" />
                </div>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} required placeholder="Marina Beach" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option value="">Select category</option>
                    <option value="Environment">Environment</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Community Service">Community Service</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Volunteer Slots *</label>
                  <input type="number" name="max_volunteers" value={formData.max_volunteers} onChange={handleInputChange} required min="1" placeholder="50" />
                </div>
              </div>

              <div className="form-group">
                <label>Required Skills (comma-separated)</label>
                <input type="text" name="required_skills" value={formData.required_skills} onChange={handleInputChange} placeholder="Communication, Teamwork, Physical Labor" />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="submit-btn">{editingEvent ? 'Update Event' : 'Create Event'}</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )}
</div>
  );
}