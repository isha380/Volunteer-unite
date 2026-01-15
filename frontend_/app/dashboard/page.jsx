// "use client";
// import { useEffect, useState } from "react";
// import { getDashboardStats, getVolunteerProfile } from "../services/api";

// export default function DashboardPage() {
//   const [profile, setProfile] = useState(null);
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const profileData = await getVolunteerProfile();
//         setProfile(profileData);

//         const statsData = await getDashboardStats();
//         setStats(statsData);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchData();
//   }, []);

//   if (!profile || !stats) return <p>Loading...</p>;

//   return (
//     <div>
//       <h1>Welcome, {profile.user?.name || profile.volunteer?.name}</h1>
//       <p>Email: {profile.user?.email || profile.volunteer?.email}</p>
//       <p>Total Volunteers: {stats.total_volunteers}</p>
//       <p>Active Events: {stats.active_events}</p>
//       <p>Urgent Events: {stats.urgent_events}</p>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getVolunteerProfile, getDashboardStats } from "../services/api";

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
    
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Fetch profile & stats together
        const [profileData, statsData] = await Promise.all([
          getVolunteerProfile(),
          getDashboardStats(),
        ]);

        setProfile(profileData);
        setStats(statsData);
      } catch (error) {
        console.error("Dashboard error:", error);

        // Invalid / expired token
        if (
          error.message?.includes("Authentication required") ||
          error.message?.includes("No access token")
        ) {
          localStorage.removeItem("access_token");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  
  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  // Safety fallback (redirect happens already)
  if (!profile || !stats) {
    return null;
  }

  //  Support both user & volunteer response shapes
  const name = profile.user?.name || profile.volunteer?.name || "Volunteer";
  const email = profile.user?.email || profile.volunteer?.email;

  return (
    <div>
      <h1>Welcome, {name} 👋</h1>
      <p>Email: {email}</p>

      <hr />

      <h2>Dashboard Stats</h2>
      <p>Total Volunteers: {stats.total_volunteers}</p>
      <p>Active Events: {stats.active_events}</p>
      <p>Urgent Events: {stats.urgent_events}</p>
    </div>
  );
}
