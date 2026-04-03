
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  AlertCircle,
  Loader,
  MapPin,
  Calendar,
  Send
} from 'lucide-react';
import './page.css';

// ============================================================================
// Constants
// ============================================================================

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const VIEW_MODES = {
  ALL: 'all',
  APPLIED: 'applied',
  RECOMMENDED: 'recommended'
};

const APPLICATION_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

const STATUS_BADGES = {
  [APPLICATION_STATUS.PENDING]: { class: 'status-pending', icon: Clock },
  [APPLICATION_STATUS.APPROVED]: { class: 'status-approved', icon: CheckCircle },
  [APPLICATION_STATUS.REJECTED]: { class: 'status-rejected', icon: XCircle }
};

const NOTIFICATION_DURATION = 3000;

// ============================================================================
// Utility Functions
// ============================================================================

const parseSkills = (skills) => {
  if (Array.isArray(skills)) return skills;
  if (typeof skills === 'string') {
    return skills.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString();
};

// ============================================================================
// API Services
// ============================================================================

const apiService = {
  async fetchEvents() {
    const response = await fetch(`${API_BASE_URL}/events/`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  async fetchApplications() {
    const response = await fetch(`${API_BASE_URL}/admin/applications`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
  },

  async fetchAppliedVolunteers(eventId) {
    const response = await fetch(
      `${API_BASE_URL}/admin/events/${eventId}/applied-matches`,
      { headers: getAuthHeaders() }
    );
    if (!response.ok) throw new Error('Failed to fetch applied volunteers');
    return response.json();
  },

  async fetchRecommendedVolunteers(eventId) {
    const response = await fetch(
      `${API_BASE_URL}/admin/events/${eventId}/matches`,
      { headers: getAuthHeaders() }
    );
    if (!response.ok) throw new Error('Failed to fetch recommended volunteers');
    return response.json();
  },

  async updateApplicationStatus(applicationId, status) {
    const response = await fetch(
      `${API_BASE_URL}/admin/applications/${applicationId}`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update application');
    }
    return response.json();
  },

  async sendInvitation(volunteerId, eventId) {
    const response = await fetch(`${API_BASE_URL}/admin/invite`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ volunteer_id: volunteerId, event_id: eventId })
    });
    if (!response.ok) throw new Error('Failed to send invitation');
    return response.json();
  }
};

// ============================================================================
// Components
// ============================================================================

// Detail Item Component
const DetailItem = ({ label, value, fullWidth = false }) => (
  <div className={`detail-item ${fullWidth ? 'full-width' : ''}`}>
    <strong>{label}:</strong>
    <span>{value}</span>
  </div>
);

// Skills Tags Component
const SkillsTags = ({ skills, maxVisible = 3 }) => {
  const skillsArray = parseSkills(skills);
  
  if (skillsArray.length === 0) return null;

  return (
    <div className="detail-item">
      <strong>Skills:</strong>
      <div className="skills-tags">
        {skillsArray.slice(0, maxVisible).map((skill, idx) => (
          <span key={idx} className="skill-tag">{skill}</span>
        ))}
        {skillsArray.length > maxVisible && (
          <span className="skill-tag more">+{skillsArray.length - maxVisible}</span>
        )}
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const badge = STATUS_BADGES[status] || STATUS_BADGES[APPLICATION_STATUS.PENDING];
  const Icon = badge.icon;

  return (
    <span className={`status-badge ${badge.class}`}>
      <Icon size={14} />
      {status}
    </span>
  );
};

// Match Score Badge Component
const MatchScoreBadge = ({ score }) => {
  if (!score) return null;

  let className = 'match-low';
  if (score >= 80) className = 'match-high';
  else if (score >= 60) className = 'match-medium';

  return (
    <span className={`match-score ${className}`}>
      {score}% Match
    </span>
  );
};

// Application Details Modal Component
const ApplicationDetailsModal = ({ application, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container details-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <XCircle size={24} />
        </button>

        <div className="modal-content">
          <h2>Application Details</h2>

          {/* Volunteer Information */}
          <section className="details-section">
            <h3>Volunteer Information</h3>
            <div className="details-grid">
              <DetailItem label="Name" value={application.volunteer.name} />
              <DetailItem label="Email" value={application.volunteer.email} />
              <DetailItem label="Phone" value={application.volunteer.phone || 'Not provided'} />
              {application.volunteer.profile && (
                <DetailItem 
                  label="Profile" 
                  value={application.volunteer.profile} 
                  fullWidth 
                />
              )}
            </div>
            <SkillsTags skills={application.volunteer.skills} maxVisible={Infinity} />
          </section>

          {/* Event Information */}
          <section className="details-section">
            <h3>Event Information</h3>
            <div className="details-grid">
              <DetailItem label="Title" value={application.event.title} fullWidth />
              <DetailItem label="Description" value={application.event.description} fullWidth />
              <DetailItem label="Location" value={application.event.location} />
              <DetailItem label="Date" value={formatDate(application.event.event_date)} />
              <DetailItem label="Time" value={application.event.event_time} />
              <DetailItem label="Category" value={application.event.category} />
            </div>
          </section>

          {/* Application Status */}
          <section className="details-section">
            <h3>Application Status</h3>
            <div className="details-grid">
              <div className="detail-item">
                <strong>Status:</strong>
                <StatusBadge status={application.status} />
              </div>
              <DetailItem label="Applied" value={formatDateTime(application.applied_at)} />
              {application.match_score && (
                <DetailItem label="Match Score" value={`${application.match_score}%`} />
              )}
              {application.status === APPLICATION_STATUS.APPROVED && (
                <DetailItem 
                  label="Confirmation" 
                  value={application.confirmation_status || 'Pending'} 
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Notification Component
const Notification = ({ message, type }) => (
  <div className={`notification ${type}`}>
    {message}
  </div>
);

// Loading Component
const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="loading-container">
    <Loader className="spinner" size={48} />
    <p>{message}</p>
  </div>
);

// Error Banner Component
const ErrorBanner = ({ message }) => (
  <div className="error-banner">
    <AlertCircle size={20} />
    <span>{message}</span>
  </div>
);

// Empty State Component
const EmptyState = ({ viewMode, searchTerm, selectedStatus }) => {
  const getMessage = () => {
    if (viewMode === VIEW_MODES.APPLIED) {
      return 'No volunteers have applied to this event yet';
    }
    if (viewMode === VIEW_MODES.RECOMMENDED) {
      return 'No recommended volunteers for this event';
    }
    if (searchTerm || selectedStatus !== 'all') {
      return 'Try adjusting your filters';
    }
    return 'No applications have been submitted yet';
  };

  return (
    <div className="empty-state">
      <Users size={64} />
      <h3>No {viewMode} volunteers found</h3>
      <p>{getMessage()}</p>
    </div>
  );
};

// Event Selector Component
const EventSelector = ({ events, selectedEvent, onChange }) => (
  <div className="event-selector-container">
    <label htmlFor="event-select">Filter by Event:</label>
    <select
      id="event-select"
      value={selectedEvent?.event_id || ''}
      onChange={(e) => onChange(e.target.value)}
      className="event-select"
    >
      <option value="">All Events</option>
      {events.map(event => (
        <option key={event.event_id} value={event.event_id}>
          {event.title} - {event.event_date}
        </option>
      ))}
    </select>
  </div>
);

// View Mode Buttons Component
const ViewModeButtons = ({ viewMode, selectedEvent, appliedCount, recommendedCount, onChange }) => (
  <div className="view-mode-buttons">
    <button
      className={`view-mode-btn ${viewMode === VIEW_MODES.ALL ? 'active' : ''}`}
      onClick={() => onChange(VIEW_MODES.ALL)}
    >
      <Filter size={18} />
      All Applications
    </button>
    {selectedEvent && (
      <>
        <button
          className={`view-mode-btn ${viewMode === VIEW_MODES.APPLIED ? 'active' : ''}`}
          onClick={() => onChange(VIEW_MODES.APPLIED)}
        >
          <CheckCircle size={18} />
          Applied
          <span className="badge-count">{appliedCount}</span>
        </button>
        <button
          className={`view-mode-btn ${viewMode === VIEW_MODES.RECOMMENDED ? 'active' : ''}`}
          onClick={() => onChange(VIEW_MODES.RECOMMENDED)}
        >
          <Users size={18} />
          Recommended
          <span className="badge-count">{recommendedCount}</span>
        </button>
      </>
    )}
  </div>
);

// Status Filters Component
const StatusFilters = ({ selectedStatus, applications, onChange }) => (
  <div className="status-filters">
    <Filter size={18} />
    {['all', APPLICATION_STATUS.PENDING, APPLICATION_STATUS.APPROVED, APPLICATION_STATUS.REJECTED].map(status => (
      <button
        key={status}
        className={`filter-btn ${selectedStatus === status ? 'active' : ''}`}
        onClick={() => onChange(status)}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
        {status !== 'all' && (
          <span className="filter-count">
            {applications.filter(app => app.status === status).length}
          </span>
        )}
      </button>
    ))}
  </div>
);

// Action Buttons Component
const ActionButtons = ({ 
  status, 
  applicationId, 
  processingId, 
  onApprove, 
  onReject, 
  onViewDetails 
}) => {
  if (status === APPLICATION_STATUS.PENDING) {
    return (
      <div className="action-buttons">
        <button
          className="btn-reject"
          onClick={() => onReject(applicationId)}
          disabled={processingId === applicationId}
        >
          {processingId === applicationId ? (
            <Loader className="spinner-small" size={16} />
          ) : (
            <>
              <XCircle size={16} />
              Reject
            </>
          )}
        </button>
        <button
          className="btn-approve"
          onClick={() => onApprove(applicationId)}
          disabled={processingId === applicationId}
        >
          {processingId === applicationId ? (
            <Loader className="spinner-small" size={16} />
          ) : (
            <>
              <CheckCircle size={16} />
              Approve
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <button className="btn-view" onClick={onViewDetails}>
      <Eye size={16} />
      View Details
    </button>
  );
};

// Application Card Component
const ApplicationCard = ({ 
  application, 
  processingId, 
  onApprove, 
  onReject, 
  onViewDetails 
}) => {
  const skillsArray = parseSkills(application.volunteer.skills);

  return (
    <div className="application-card">
      {/* Card Header */}
      <div className="card-header">
        <div className="volunteer-info">
          <div className="volunteer-avatar">
            {application.volunteer.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{application.volunteer.name}</h3>
            <p className="volunteer-email">{application.volunteer.email}</p>
          </div>
        </div>
        <StatusBadge status={application.status} />
      </div>

      {/* Event Info */}
      <div className="event-info">
        <h4>{application.event.title}</h4>
        <div className="event-details">
          <span className="detail-with-icon">
            <MapPin size={16} />
            {application.event.location}
          </span>
          <span className="detail-with-icon">
            <Calendar size={16} />
            {formatDate(application.event.event_date)}
          </span>
          <span className="detail-with-icon">
            <Clock size={16} />
            {application.event.event_time}
          </span>
        </div>
        {application.event.category && (
          <span className="event-category">{application.event.category}</span>
        )}
      </div>

      {/* Skills */}
      {skillsArray.length > 0 && (
        <div className="skills-section">
          <strong>Skills:</strong>
          <SkillsTags skills={application.volunteer.skills} />
        </div>
      )}

      {/* Footer */}
      <div className="card-footer">
        <div className="footer-info">
          <MatchScoreBadge score={application.match_score} />
          <span className="applied-date">
            Applied: {formatDate(application.applied_at)}
          </span>
        </div>
        <ActionButtons
          status={application.status}
          applicationId={application.application_id}
          processingId={processingId}
          onApprove={onApprove}
          onReject={onReject}
          onViewDetails={() => onViewDetails(application)}
        />
      </div>

      {/* Confirmation Status */}
      {application.status === APPLICATION_STATUS.APPROVED && (
        <div className="confirmation-status">
          Confirmation: <strong>{application.confirmation_status || 'Pending'}</strong>
        </div>
      )}
    </div>
  );
};

// Match Card Component
const MatchCard = ({ 
  match, 
  selectedEvent, 
  viewMode, 
  hasApplied, 
  processingId, 
  onApprove, 
  onReject, 
  onInvite 
}) => {
  const skillsArray = parseSkills(match.skills);

  return (
    <div className="application-card">
      {/* Card Header */}
      <div className="card-header">
        <div className="volunteer-info">
          <div className="volunteer-avatar">
            {match.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{match.name}</h3>
            <p className="volunteer-email">{match.email || ''}</p>
          </div>
        </div>
      </div>

      {/* Event Info */}
      <div className="event-info">
        <h4>{selectedEvent?.title || 'Event'}</h4>
        <div className="event-details">
          <span className="detail-with-icon">
            <MapPin size={16} />
            {selectedEvent?.location || 'Location'}
          </span>
          <span className="detail-with-icon">
            <Calendar size={16} />
            {selectedEvent?.event_date ? formatDate(selectedEvent.event_date) : 'Date'}
          </span>
          <span className="detail-with-icon">
            <Clock size={16} />
            {selectedEvent?.event_time || 'Time'}
          </span>
        </div>
        {selectedEvent?.category && (
          <span className="event-category">{selectedEvent.category}</span>
        )}
      </div>

      {/* Skills */}
      {skillsArray.length > 0 && (
        <div className="skills-section">
          <strong>Skills:</strong>
          <SkillsTags skills={match.skills} />
        </div>
      )}

      {/* Footer */}
      <div className="card-footer">
        <div className="footer-info">
          <span className="applied-date">
            <Calendar size={16} />
            Applied: {match.applied_at ? formatDate(match.applied_at) : 'N/A'}
          </span>
          <span className="match-score-text">
            Match Score: <strong>{match.match_score || 0}</strong>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          {viewMode === VIEW_MODES.APPLIED && (
            <>
              <button
                className="btn-reject"
                onClick={() => onReject(match.application_id)}
                disabled={processingId === match.application_id}
              >
                {processingId === match.application_id ? (
                  <Loader className="spinner-small" size={16} />
                ) : (
                  <>
                    <XCircle size={16} />
                    Reject
                  </>
                )}
              </button>
              <button
                className="btn-approve"
                onClick={() => onApprove(match.application_id)}
                disabled={processingId === match.application_id}
              >
                {processingId === match.application_id ? (
                  <Loader className="spinner-small" size={16} />
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Approve
                  </>
                )}
              </button>
            </>
          )}

          {viewMode === VIEW_MODES.RECOMMENDED && (
            <>
              {hasApplied ? (
                <>
                  <button
                    className="btn-reject"
                    onClick={() => onReject(match.application_id)}
                    disabled={processingId === match.application_id}
                  >
                    {processingId === match.application_id ? (
                      <Loader className="spinner-small" size={16} />
                    ) : (
                      <>
                        <XCircle size={16} />
                        Reject
                      </>
                    )}
                  </button>
                  <button
                    className="btn-approve"
                    onClick={() => onApprove(match.application_id)}
                    disabled={processingId === match.application_id}
                  >
                    {processingId === match.application_id ? (
                      <Loader className="spinner-small" size={16} />
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Approve
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  className="btn-invite"
                  onClick={() => onInvite(match.volunteer_id)}
                  disabled={processingId === match.volunteer_id}
                >
                  {processingId === match.volunteer_id ? (
                    <Loader className="spinner-small" size={16} />
                  ) : (
                    <>
                      <Send size={16} />
                      Invite
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export default function AdminVolunteersPage() {
  const router = useRouter();

  // State
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [notification, setNotification] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState(VIEW_MODES.ALL);
  const [appliedMatches, setAppliedMatches] = useState([]);
  const [recommendedMatches, setRecommendedMatches] = useState([]);

  // Computed values
  const currentMatches = useMemo(() => 
    viewMode === VIEW_MODES.APPLIED ? appliedMatches : recommendedMatches,
    [viewMode, appliedMatches, recommendedMatches]
  );

  // ============================================================================
  // Helper Functions
  // ============================================================================

  const showNotification = useCallback((message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), NOTIFICATION_DURATION);
  }, []);

  const hasVolunteerApplied = useCallback((volunteerId) => {
    return appliedMatches.some(match => match.volunteer_id === volunteerId);
  }, [appliedMatches]);

  const filterApplicationsBySearch = useCallback((apps) => {
    if (!searchTerm) return apps;
    
    const lowerSearch = searchTerm.toLowerCase();
    return apps.filter(app =>
      app.volunteer.name.toLowerCase().includes(lowerSearch) ||
      app.volunteer.email.toLowerCase().includes(lowerSearch) ||
      app.event.title.toLowerCase().includes(lowerSearch)
    );
  }, [searchTerm]);

  const filterApplicationsByStatus = useCallback((apps) => {
    if (selectedStatus === 'all') return apps;
    return apps.filter(app => app.status.toLowerCase() === selectedStatus.toLowerCase());
  }, [selectedStatus]);

  // ============================================================================
  // Data Fetching
  // ============================================================================

  const loadEvents = useCallback(async () => {
    try {
      const data = await apiService.fetchEvents();
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, []);

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.fetchApplications();
      setApplications(data);
      setError('');
    } catch (err) {
      setError(err.message);
      showNotification('Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const loadAppliedVolunteers = useCallback(async (eventId) => {
    try {
      setLoading(true);
      const data = await apiService.fetchAppliedVolunteers(eventId);
      setAppliedMatches(data || []);
    } catch (error) {
      console.error('Error fetching applied volunteers:', error);
      showNotification('Failed to load applied volunteers', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const loadRecommendedVolunteers = useCallback(async (eventId) => {
    try {
      setLoading(true);
      const data = await apiService.fetchRecommendedVolunteers(eventId);
      setRecommendedMatches(data || []);
    } catch (error) {
      console.error('Error fetching recommended volunteers:', error);
      showNotification('Failed to load recommended volunteers', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleEventChange = useCallback((eventId) => {
    if (!eventId) {
      setSelectedEvent(null);
      setViewMode(VIEW_MODES.ALL);
      setAppliedMatches([]);
      setRecommendedMatches([]);
      return;
    }

    const event = events.find(e => e.event_id === parseInt(eventId));
    setSelectedEvent(event);
    setViewMode(VIEW_MODES.APPLIED);

    loadAppliedVolunteers(eventId);
    loadRecommendedVolunteers(eventId);
  }, [events, loadAppliedVolunteers, loadRecommendedVolunteers]);

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);

    if (mode === VIEW_MODES.ALL) {
      setSelectedEvent(null);
      setAppliedMatches([]);
      setRecommendedMatches([]);
    }
  }, []);

  const handleStatusUpdate = useCallback(async (applicationId, newStatus) => {
    try {
      setProcessingId(applicationId);
      await apiService.updateApplicationStatus(applicationId, newStatus);

      setApplications(prevApps =>
        prevApps.map(app =>
          app.application_id === applicationId
            ? {
                ...app,
                status: newStatus,
                confirmation_status: newStatus === APPLICATION_STATUS.APPROVED 
                  ? 'Pending' 
                  : app.confirmation_status
              }
            : app
        )
      );

      showNotification(`Application ${newStatus.toLowerCase()} successfully!`, 'success');

      if (viewMode === VIEW_MODES.APPLIED && selectedEvent) {
        loadAppliedVolunteers(selectedEvent.event_id);
      }
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setProcessingId(null);
    }
  }, [viewMode, selectedEvent, loadAppliedVolunteers, showNotification]);

  const handleInvite = useCallback(async (volunteerId) => {
    try {
      setProcessingId(volunteerId);
      await apiService.sendInvitation(volunteerId, selectedEvent.event_id);
      showNotification('Invitation sent successfully!', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setProcessingId(null);
    }
  }, [selectedEvent, showNotification]);

  // ============================================================================
  // Effects
  // ============================================================================

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/admin/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== 'admin') {
        router.push('/admin/login');
        return;
      }
    } catch (error) {
      router.push('/admin/login');
      return;
    }

    loadEvents();
    loadApplications();
  }, [router, loadEvents, loadApplications]);

  // Filter applications
  useEffect(() => {
    if (viewMode === VIEW_MODES.ALL) {
      let filtered = applications;
      filtered = filterApplicationsByStatus(filtered);
      filtered = filterApplicationsBySearch(filtered);
      setFilteredApplications(filtered);
    }
  }, [applications, viewMode, filterApplicationsByStatus, filterApplicationsBySearch]);

  // ============================================================================
  // Render
  // ============================================================================

  if (loading) {
    return <LoadingSpinner message="Loading volunteers..." />;
  }

  return (
    <div className="admin-volunteers-page">
      {notification && <Notification {...notification} />}

      {/* Page Header */}
      <header className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <Users size={32} />
          </div>
          <div>
            <h1>Volunteer Applications</h1>
            <p>Review and manage volunteer applications</p>
          </div>
        </div>
      </header>

      {error && <ErrorBanner message={error} />}

      {/* Event Selector */}
      <EventSelector
        events={events}
        selectedEvent={selectedEvent}
        onChange={handleEventChange}
      />

      {/* Filters Section */}
      <section className="filters-section">
        {/* Search Box */}
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by volunteer name, email, or event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* View Mode Buttons */}
        <ViewModeButtons
          viewMode={viewMode}
          selectedEvent={selectedEvent}
          appliedCount={appliedMatches.length}
          recommendedCount={recommendedMatches.length}
          onChange={handleViewModeChange}
        />

        {/* Status Filters */}
        {viewMode === VIEW_MODES.ALL && (
          <StatusFilters
            selectedStatus={selectedStatus}
            applications={applications}
            onChange={setSelectedStatus}
          />
        )}
      </section>

      {/* Applications Grid */}
      <main className="applications-grid">
        {/* All Applications View */}
        {viewMode === VIEW_MODES.ALL && (
          <>
            {filteredApplications.length === 0 ? (
              <EmptyState
                viewMode={viewMode}
                searchTerm={searchTerm}
                selectedStatus={selectedStatus}
              />
            ) : (
              filteredApplications.map(application => (
                <ApplicationCard
                  key={application.application_id}
                  application={application}
                  processingId={processingId}
                  onApprove={(id) => handleStatusUpdate(id, APPLICATION_STATUS.APPROVED)}
                  onReject={(id) => handleStatusUpdate(id, APPLICATION_STATUS.REJECTED)}
                  onViewDetails={setSelectedApplication}
                />
              ))
            )}
          </>
        )}

        {/* Applied/Recommended Matches View */}
        {(viewMode === VIEW_MODES.APPLIED || viewMode === VIEW_MODES.RECOMMENDED) && (
          <>
            {currentMatches.length === 0 ? (
              <EmptyState viewMode={viewMode} />
            ) : (
              currentMatches.map((match, index) => (
                <MatchCard
                  key={index}
                  match={match}
                  selectedEvent={selectedEvent}
                  viewMode={viewMode}
                  hasApplied={hasVolunteerApplied(match.volunteer_id)}
                  processingId={processingId}
                  onApprove={(id) => handleStatusUpdate(id, APPLICATION_STATUS.APPROVED)}
                  onReject={(id) => handleStatusUpdate(id, APPLICATION_STATUS.REJECTED)}
                  onInvite={handleInvite}
                />
              ))
            )}
          </>
        )}
      </main>

      {/* Application Details Modal */}
      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}
