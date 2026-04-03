
// "use client";
// import { useEffect, useState } from "react";
// import { Calendar, Users, AlarmClock } from "lucide-react";
// import StatsCard from "@/app/components/cards/StatsCard";
// import { getDashboardStats } from "@/app/services/api";
// import "./events.css";

// export default function BrowseEvents() {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         //  login checked before calling dashboard API
//         const token = localStorage.getItem("access_token");

//         if (!token) {
//           setStats({
//             active_events: 0,
//             total_volunteers: 0,
//             urgent_events: 0
//           });
//           return;
//         }

//         const data = await getDashboardStats();
//         setStats(data);
//       } catch (error) {
//         console.error("Error loading stats:", error);
//         setStats({
//           active_events: 0,
//           total_volunteers: 0,
//           urgent_events: 0
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   if (loading) {
//     return <p className="loading">Loading events...</p>;
//   }

//   if (!stats) {
//     return null;
//   }

//   const activeEvents = stats.active_events ?? stats.activeEvents ?? 0;
//   const totalVolunteers = stats.total_volunteers ?? stats.totalVolunteers ?? 0;
//   const urgentEvents = stats.urgent_events ?? stats.urgentEvents ?? 0;

//   return (
//     <div className="events-page">
//       <div className="events-container">
//         {/* HEADER */}
//         <header className="events-header">
//           <h1>Discover Volunteer Opportunities</h1>
//           <p>
//             Find events that match your skills and interests. Every contribution makes a difference.
//           </p>
//           <input
//             className="events-search"
//             placeholder="Search by title, category, or skills..."
//           />
//         </header>

//         {/* STATS */}
//         <div className="events-stats-row">
//           <StatsCard
//             icon={<Calendar size={22} />}
//             value={activeEvents}
//             label="Active Events"
//           />
//           <StatsCard
//             icon={<Users size={22} />}
//             value={totalVolunteers}
//             label="Total Volunteers"
//           />
//           <StatsCard
//             icon={<AlarmClock size={22} />}
//             value={urgentEvents}
//             label="Urgent Events"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }


// 2)

// "use client";
// import { useEffect, useState } from "react";
// import { Calendar, Users, AlarmClock } from "lucide-react";
// import StatsCard from "@/app/components/cards/StatsCard";
// import EventCard from "@/app/components/cards/EventCard";
// import { getDashboardStats } from "@/app/services/api";
// import axios from "axios";
// import "./events.css";

// export default function BrowseEvents() {
//   const [stats, setStats] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [filteredEvents, setFilteredEvents] = useState([]);
//   const [appliedEvents, setAppliedEvents] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadData();
//   }, []);

//   useEffect(() => {

//     if (searchQuery.trim() === "") {
//       setFilteredEvents(events);
//     } else {
//       const query = searchQuery.toLowerCase();
//       const filtered = events.filter(event => 
//         event.title.toLowerCase().includes(query) ||
//         event.category?.toLowerCase().includes(query) ||
//         event.location.toLowerCase().includes(query) ||
//         event.required_skills?.some(skill => 
//           skill.toLowerCase().includes(query)
//         )
//       );
//       setFilteredEvents(filtered);
//     }
//   }, [searchQuery, events]);

//   const loadData = async () => {
//     try {
      
//       const token = localStorage.getItem("access_token");

//       // Fetch stats
//       if (token) {
//         const statsData = await getDashboardStats();
//         setStats(statsData);
//       } else {
//         setStats({
//           active_events: 0,
//           total_volunteers: 0,
//           urgent_events: 0
//         });
//       }

     
//       await fetchEvents();

//       // Fetch user's applications
//       if (token) {
//         await fetchMyApplications();
//       }

//     } catch (error) {
//       console.error("Error loading data:", error);
//       setStats({
//         active_events: 0,
//         total_volunteers: 0,
//         urgent_events: 0
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchEvents = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/events');
//       setEvents(response.data);
//       setFilteredEvents(response.data);
//     } catch (error) {
//       console.error('Error fetching events:', error);
//       setEvents([]);
//       setFilteredEvents([]);
//     }
//   };

//   const fetchMyApplications = async () => {
//     try {
//       const token = localStorage.getItem('access_token');
//       if (!token) return;
      
//       const response = await axios.get('http://localhost:5000/volunteers/my-applications', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       const eventIds = response.data.map(app => app.event.event_id);
//       setAppliedEvents(eventIds);
//     } catch (error) {
//       console.error('Error fetching applications:', error);
//     }
//   };

//   const handleApply = async (eventId) => {
//     try {
//       const token = localStorage.getItem('access_token');
      
//       if (!token) {
//         alert('Please login to apply for events');
//         window.location.href = '/login';
//         return;
//       }

//       await axios.post(
//         `http://localhost:5000/volunteers/apply/${eventId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert('Application submitted successfully!');
//       setAppliedEvents([...appliedEvents, eventId]);
//       fetchEvents(); // Refresh to update slot counts
//     } catch (error) {
//       console.error('Error applying:', error);
//       alert(error.response?.data?.message || 'Failed to apply for event');
//     }
//   };

//   if (loading) {
//     return <p className="loading">Loading events...</p>;
//   }

//   if (!stats) {
//     return null;
//   }

//   const activeEvents = stats.active_events ?? stats.activeEvents ?? 0;
//   const totalVolunteers = stats.total_volunteers ?? stats.totalVolunteers ?? 0;
//   const urgentEvents = stats.urgent_events ?? stats.urgentEvents ?? 0;

//   return (
//     <div className="events-page">
//       <div className="events-container">
      
//         <header className="events-header">
//           <h1>Discover Volunteer Opportunities</h1>
//           <p>
//             Find events that match your skills and interests. Every contribution makes a difference.
//           </p>
//           <input
//             className="events-search"
//             placeholder="Search by title, category, or skills..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </header>

      
//         <div className="events-stats-row">
//           <StatsCard
//             icon={<Calendar size={22} />}
//             value={activeEvents}
//             label="Active Events"
//           />
//           <StatsCard
//             icon={<Users size={22} />}
//             value={totalVolunteers}
//             label="Total Volunteers"
//           />
//           <StatsCard
//             icon={<AlarmClock size={22} />}
//             value={urgentEvents}
//             label="Urgent Events"
//           />
//         </div>

//         {/* AVAILABLE OPPORTUNITIES */}
//         <section className="opportunities-section">
//           <h2 className="section-title">Available Opportunities</h2>
          
//           {filteredEvents.length === 0 ? (
//             <div className="no-events">
//               <p>
//                 {searchQuery 
//                   ? "No events found matching your search." 
//                   : "No events available at the moment."}
//               </p>
//             </div>
//           ) : (
//             <div className="events-grid">
//               {filteredEvents.map(event => (
//                 <EventCard
//                   key={event.event_id}
//                   event={event}
//                   onApply={handleApply}
//                   hasApplied={appliedEvents.includes(event.event_id)}
//                 />
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }

// 2

// "use client";
// import { useEffect, useState } from "react";
// import { Calendar, Users, AlarmClock } from "lucide-react";
// import StatsCard from "@/app/components/cards/StatsCard";
// import EventCard from "@/app/components/cards/EventCard";
// import ApplicationModal from "@/app/components/ui/ApplicationModal";
// import { getDashboardStats } from "@/app/services/api";
// import axios from "axios";
// import "./events.css";

// export default function BrowseEvents() {
//   const [stats, setStats] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [filteredEvents, setFilteredEvents] = useState([]);
//   const [appliedEvents, setAppliedEvents] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
  
//   // Modal states
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     loadData();
//   }, []);

//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       setFilteredEvents(events);
//     } else {
//       const query = searchQuery.toLowerCase();
//       const filtered = events.filter(event => 
//         event.title.toLowerCase().includes(query) ||
//         event.category?.toLowerCase().includes(query) ||
//         event.location.toLowerCase().includes(query) ||
//         event.required_skills?.some(skill => 
//           skill.toLowerCase().includes(query)
//         )
//       );
//       setFilteredEvents(filtered);
//     }
//   }, [searchQuery, events]);

//   const loadData = async () => {
//     try {
//       // const token = localStorage.getItem("access_token");
//       const token = localStorage.getItem('token');

//       if (token) {
//         const statsData = await getDashboardStats();
//         setStats(statsData);
//       } else {
//         setStats({
//           active_events: 0,
//           total_volunteers: 0,
//           urgent_events: 0
//         });
//       }

//       await fetchEvents();

//       if (token) {
//         await fetchMyApplications();
//       }
//     } catch (error) {
//       console.error("Error loading data:", error);
//       setStats({
//         active_events: 0,
//         total_volunteers: 0,
//         urgent_events: 0
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchEvents = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/events');
//       setEvents(response.data);
//       setFilteredEvents(response.data);
//     } catch (error) {
//       console.error('Error fetching events:', error);
//       setEvents([]);
//       setFilteredEvents([]);
//     }
//   };

//   const fetchMyApplications = async () => {
//     try {
      
//       const token = localStorage.getItem('token');
//       if (!token) return;
      
//       const response = await axios.get('http://localhost:5000/volunteers/my-applications', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       const eventIds = response.data.map(app => app.event.event_id);
//       setAppliedEvents(eventIds);
//     } catch (error) {
//       console.error('Error fetching applications:', error);
//     }
//   };

//   // Updated handleApply to show modal
//   const handleApply = (eventId) => {
    
//     const token = localStorage.getItem('token');
    
//     if (!token) {
//       alert('Please login to apply for events');
//       window.location.href = '/login';
//       return;
//     }

//     // Find the event and open modal
//     const event = events.find(e => e.event_id === eventId);
//     setSelectedEvent(event);
//     setShowModal(true);
//   };

//   // Handle form submission from modal
//   const handleSubmitApplication = async (eventId, formData) => {
//     try {
      
//       const token = localStorage.getItem('token');
      
//       await axios.post(
//         `http://localhost:5000/volunteers/apply/${eventId}`,
//         formData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Update applied events list
//       setAppliedEvents([...appliedEvents, eventId]);
      
//       // Refresh events to update slot counts
//       await fetchEvents();
//     } catch (error) {
//       console.error('Error applying:', error);
//       throw error; // Re-throw to let modal handle the error
//     }
//   };

//   if (loading) {
//     return <p className="loading">Loading events...</p>;
//   }

//   if (!stats) {
//     return null;
//   }

//   const activeEvents = stats.active_events ?? stats.activeEvents ?? 0;
//   const totalVolunteers = stats.total_volunteers ?? stats.totalVolunteers ?? 0;
//   const urgentEvents = stats.urgent_events ?? stats.urgentEvents ?? 0;

//   return (
//     <div className="events-page">
//       <div className="events-container">
//         <header className="events-header">
//           <h1>Discover Volunteer Opportunities</h1>
//           <p>
//             Find events that match your skills and interests. Every contribution makes a difference.
//           </p>
//           <input
//             className="events-search"
//             placeholder="Search by title, category, or skills..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </header>

//         <div className="events-stats-row">
//           <StatsCard
//             icon={<Calendar size={22} />}
//             value={activeEvents}
//             label="Active Events"
//           />
//           <StatsCard
//             icon={<Users size={22} />}
//             value={totalVolunteers}
//             label="Total Volunteers"
//           />
//           <StatsCard
//             icon={<AlarmClock size={22} />}
//             value={urgentEvents}
//             label="Urgent Events"
//           />
//         </div>

//         <section className="opportunities-section">
//           <h2 className="section-title">Available Opportunities</h2>
          
//           {filteredEvents.length === 0 ? (
//             <div className="no-events">
//               <p>
//                 {searchQuery 
//                   ? "No events found matching your search." 
//                   : "No events available at the moment."}
//               </p>
//             </div>
//           ) : (
//             <div className="events-grid">
//               {filteredEvents.map(event => (
//                 <EventCard
//                   key={event.event_id}
//                   event={event}
//                   onApply={handleApply}
//                   hasApplied={appliedEvents.includes(event.event_id)}
//                 />
//               ))}
//             </div>
//           )}
//         </section>
//       </div>

//       {/* Application Modal */}
//       {selectedEvent && (
//         <ApplicationModal
//           event={selectedEvent}
//           isOpen={showModal}
//           onClose={() => {
//             setShowModal(false);
//             setSelectedEvent(null);
//           }}
//           onSubmit={handleSubmitApplication}
//         />
//       )}
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import { Calendar, Users, AlarmClock } from "lucide-react";
import StatsCard from "@/app/components/cards/StatsCard";
import EventCard from "@/app/components/cards/EventCard";
import ApplicationModal from "@/app/components/ui/ApplicationModal";
import { getDashboardStats } from "@/app/services/api";
import axios from "axios";
import "./events.css";

export default function BrowseEvents() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [appliedEvents, setAppliedEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEvents(events);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = events.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.category?.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.required_skills?.some(skill => 
          skill.toLowerCase().includes(query)
        )
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const statsData = await getDashboardStats();
        setStats(statsData);
      } else {
        setStats({
          active_events: 0,
          total_volunteers: 0,
          urgent_events: 0
        });
      }

      await fetchEvents();

      if (token) {
        await fetchMyApplications();
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setStats({
        active_events: 0,
        total_volunteers: 0,
        urgent_events: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data);
      setFilteredEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
      setFilteredEvents([]);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get('http://localhost:5000/volunteers/my-applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const eventIds = response.data.map(app => app.event.event_id);
      setAppliedEvents(eventIds);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  // Updated handleApply to show modal
  const handleApply = (eventId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please login to apply for events');
      window.location.href = '/login';
      return;
    }

    // Find the event and open modal
    const event = events.find(e => e.event_id === eventId);
    setSelectedEvent(event);
    setShowModal(true);
  };

  // Handle form submission from modal
  const handleSubmitApplication = async (eventId, formData) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        `http://localhost:5000/volunteers/apply/${eventId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update applied events list
      setAppliedEvents([...appliedEvents, eventId]);
      
      // Refresh events to update slot counts
      await fetchEvents();
    } catch (error) {
      console.error('Error applying:', error);
      throw error; // Re-throw to let modal handle the error
    }
  };

  if (loading) {
    return <p className="loading">Loading events...</p>;
  }

  if (!stats) {
    return null;
  }

  const activeEvents = stats.active_events ?? stats.activeEvents ?? 0;
  const totalVolunteers = stats.total_volunteers ?? stats.totalVolunteers ?? 0;
  const urgentEvents = stats.urgent_events ?? stats.urgentEvents ?? 0;

  return (
    <div className="events-page">
      <div className="events-container">
        <header className="events-header">
          <h1>Discover Volunteer Opportunities</h1>
          <p>
            Find events that match your skills and interests. Every contribution makes a difference.
          </p>
          <input
            className="events-search"
            placeholder="Search by title, category, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </header>

        <div className="events-stats-row">
          <StatsCard
            icon={<Calendar size={22} />}
            value={activeEvents}
            label="Active Events"
          />
          <StatsCard
            icon={<Users size={22} />}
            value={totalVolunteers}
            label="Total Volunteers"
          />
          <StatsCard
            icon={<AlarmClock size={22} />}
            value={urgentEvents}
            label="Urgent Events"
          />
        </div>

        <section className="opportunities-section">
          <h2 className="section-title">Available Opportunities</h2>
          
          {filteredEvents.length === 0 ? (
            <div className="no-events">
              <p>
                {searchQuery 
                  ? "No events found matching your search." 
                  : "No events available at the moment."}
              </p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map(event => (
                <EventCard
                  key={event.event_id}
                  event={event}
                  onApply={handleApply}
                  hasApplied={appliedEvents.includes(event.event_id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Application Modal */}
      {selectedEvent && (
        <ApplicationModal
          event={selectedEvent}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedEvent(null);
          }}
          onSubmit={handleSubmitApplication}
        />
      )}
    </div>
  );
}