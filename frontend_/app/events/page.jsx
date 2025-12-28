"use client";

import { useEffect, useState } from "react";
import { Calendar, Users, AlarmClock } from "lucide-react";
import StatsCard from "@/app/components/cards/StatsCard";
import { getDashboardStats } from "@/app/services/api";

import "./events.css";

export default function BrowseEvents() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Error loading stats:", err);
      }
    }

    loadData();
  }, []);

  if (!stats) return <p className="loading">Loading events...</p>;

  return (
    <div className="events-page">
      <div className="events-container">

        {/* HEADER */}
        <header className="events-header">
          <h1>Discover Volunteer Opportunities</h1>
          <p>
            Find events that match your skills and interests.
            Every contribution makes a difference.
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
            value={stats.activeEvents}
            label="Active Events"
          />
          <StatsCard
            icon={<Users size={22} />}
            value={stats.totalVolunteers}
            label="Total Volunteers"
          />
          <StatsCard
            icon={<AlarmClock size={22} />}
            value={stats.urgentEvents}
            label="Urgent Events"
          />
        </div>

      </div>
    </div>
  );
}
