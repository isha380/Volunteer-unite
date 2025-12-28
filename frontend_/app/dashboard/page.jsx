"use client";
import { useEffect, useState } from "react";
import { getDashboardStats, getVolunteerProfile } from "../services/api";

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getVolunteerProfile();
        setProfile(profileData);

        const statsData = await getDashboardStats();
        setStats(statsData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (!profile || !stats) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {profile.user?.name || profile.volunteer?.name}</h1>
      <p>Email: {profile.user?.email || profile.volunteer?.email}</p>
      <p>Total Volunteers: {stats.total_volunteers}</p>
      <p>Active Events: {stats.active_events}</p>
      <p>Urgent Events: {stats.urgent_events}</p>
    </div>
  );
}
