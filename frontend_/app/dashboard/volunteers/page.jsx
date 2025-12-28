"use client";

import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import { getDashboardStats } from "../../services/api";

import "./dashboard.css";

export default function VolunteerDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const statsData = await getDashboardStats();
        setStats(statsData);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    }

    loadData();
  }, []);

  if (!stats) return <p className="loading">Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <div className="top-header">
        <div>
          <h1 className="dashboard-title">Discover Volunteer Opportunities</h1>
          <p className="dashboard-subtitle">
            Find events that match your skills. Every contribution matters.
          </p>
        </div>

        {/* Profile Removed */}
        {/* <div className="profile-section"> ... </div> */}
      </div>

      {/* SEARCH BAR */}
      <input
        className="search-bar"
        placeholder="Search by title, category, or skills..."
      />

      {/* STATS ROW */}
      <div className="stats-row">
        <StatsCard icon="📅" value={stats.activeEvents} label="Active Events" />
        <StatsCard
          icon="👥"
          value={stats.totalVolunteers}
          label="Total Volunteers"
        />
        <StatsCard icon="⏱️" value={stats.urgentEvents} label="Urgent Events" />
      </div>
    </div>
  );
}
