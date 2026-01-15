// "use client";

// import { useEffect, useState } from "react";
// import { Calendar, Users, AlarmClock } from "lucide-react";
// import StatsCard from "@/app/components/cards/StatsCard";
// import { getDashboardStats } from "@/app/services/api";

// import "./events.css";

// export default function BrowseEvents() {
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     async function loadData() {
//       try {
//         const data = await getDashboardStats();
//         setStats(data);
//       } catch (err) {
//         console.error("Error loading stats:", err);
//       }
//     }

//     loadData();
//   }, []);

//   if (!stats) return <p className="loading">Loading events...</p>;

//   return (
//     <div className="events-page">
//       <div className="events-container">

//         {/* HEADER */}
//         <header className="events-header">
//           <h1>Discover Volunteer Opportunities</h1>
//           <p>
//             Find events that match your skills and interests.
//             Every contribution makes a difference.
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
//             value={stats.activeEvents}
//             label="Active Events"
//           />
//           <StatsCard
//             icon={<Users size={22} />}
//             value={stats.totalVolunteers}
//             label="Total Volunteers"
//           />
//           <StatsCard
//             icon={<AlarmClock size={22} />}
//             value={stats.urgentEvents}
//             label="Urgent Events"
//           />
//         </div>

//       </div>
//     </div>
//   );
// }


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
//         const data = await getDashboardStats();
//         setStats(data);
//       } catch (error) {
//         console.error("Error loading stats:", error);
//         // Don't redirect on error, just show empty stats
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

"use client";
import { useEffect, useState } from "react";
import { Calendar, Users, AlarmClock } from "lucide-react";
import StatsCard from "@/app/components/cards/StatsCard";
import { getDashboardStats } from "@/app/services/api";
import "./events.css";

export default function BrowseEvents() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        //  login checked before calling dashboard API
        const token = localStorage.getItem("access_token");

        if (!token) {
          setStats({
            active_events: 0,
            total_volunteers: 0,
            urgent_events: 0
          });
          return;
        }

        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error loading stats:", error);
        setStats({
          active_events: 0,
          total_volunteers: 0,
          urgent_events: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
        {/* HEADER */}
        <header className="events-header">
          <h1>Discover Volunteer Opportunities</h1>
          <p>
            Find events that match your skills and interests. Every contribution makes a difference.
          </p>
          <input
            className="events-search"
            placeholder="Search by title, category, or skills..."
          />
        </header>

        {/* STATS */}
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
      </div>
    </div>
  );
}
