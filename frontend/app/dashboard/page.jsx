import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import { getDashboardStats } from "../services/eventService";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeEvents: 0,
    totalVolunteers: 0,
    urgentEvents: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const res = await getDashboardStats();
      setStats(res);
    }
    fetchStats();
  }, []);

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <h1 className="dashboard-title">Discover Volunteer Opportunities</h1>
        <p className="dashboard-subtitle">
          Find events that match your skills and interests. Every contribution makes a difference.
        </p>

        <input
          type="text"
          className="search-bar"
          placeholder="Search by title, category, or skills..."
        />

        <div className="stats-row">
          <StatsCard icon="📅" number={stats.activeEvents} label="Active Events" />
          <StatsCard icon="👥" number={stats.totalVolunteers} label="Total Volunteers" />
          <StatsCard icon="⏳" number={stats.urgentEvents} label="Urgent Events" />
        </div>

        <h2 className="section-title">Available Opportunities</h2>
      </div>
    </>
  );
};

export default Dashboard;
