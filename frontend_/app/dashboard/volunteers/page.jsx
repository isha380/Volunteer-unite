// "use client";

// import { useEffect, useState } from "react";
// import StatsCard from "./StatsCard";
// import { getDashboardStats } from "../../services/api";

// import "./dashboard.css";

// export default function VolunteerDashboard() {
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     async function loadData() {
//       try {
//         const statsData = await getDashboardStats();
//         setStats(statsData);
//       } catch (error) {
//         console.error("Dashboard fetch error:", error);
//       }
//     }

//     loadData();
//   }, []);

//   if (!stats) return <p className="loading">Loading dashboard...</p>;

//   return (
//     <div className="dashboard-container">
//       {/* HEADER */}
//       <div className="top-header">
//         <div>
//           <h1 className="dashboard-title">Discover Volunteer Opportunities</h1>
//           <p className="dashboard-subtitle">
//             Find events that match your skills. Every contribution matters.
//           </p>
//         </div>

//         {/* Profile Removed */}
//         {/* <div className="profile-section"> ... </div> */}
//       </div>

//       {/* SEARCH BAR */}
//       <input
//         className="search-bar"
//         placeholder="Search by title, category, or skills..."
//       />

//       {/* STATS ROW */}
//       <div className="stats-row">
//         <StatsCard icon="📅" value={stats.activeEvents} label="Active Events" />
//         <StatsCard
//           icon="👥"
//           value={stats.totalVolunteers}
//           label="Total Volunteers"
//         />
//         <p className="dashboard-subtitle">
//             ishaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
//           </p>
//         <StatsCard icon="⏱️" value={stats.urgentEvents} label="Urgent Events" />
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, Award, Calendar, Users, Zap,
  CheckCircle, Clock, Star, Shield, Heart, Trophy
} from "lucide-react";
import { getVolunteerProfile, getDashboardStats } from "../../services/api";
import styles from "./dashboard.module.css";

function getBadgeIcon(badgeName = "") {
  const name = badgeName.toLowerCase();
  if (name.includes("top") || name.includes("star")) return Star;
  if (name.includes("hero") || name.includes("shield")) return Shield;
  if (name.includes("care") || name.includes("heart")) return Heart;
  if (name.includes("champion") || name.includes("trophy")) return Trophy;
  if (name.includes("fast") || name.includes("zap")) return Zap;
  return Award;
}

function StatsCard({ icon: Icon, value, label, color }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ background: color + "18", color }}>
        <Icon size={20} />
      </div>
      <div>
        <p className={styles.statValue}>{value ?? "—"}</p>
        <p className={styles.statLabel}>{label}</p>
      </div>
    </div>
  );
}

function BadgeCard({ badge }) {
  const Icon = getBadgeIcon(badge.badge_name || badge.name || "");
  return (
    <div className={styles.badgeCard}>
      <div className={styles.badgeIconWrap}>
        <Icon size={28} />
      </div>
      <p className={styles.badgeName}>{badge.badge_name || badge.name}</p>
      <p className={styles.badgeDesc}>{badge.description || "Achievement unlocked"}</p>
      {badge.awarded_at && (
        <p className={styles.badgeDate}>
          {new Date(badge.awarded_at).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
          })}
        </p>
      )}
    </div>
  );
}

function NotificationItem({ notif }) {
  return (
    <div className={`${styles.notifItem} ${!notif.read ? styles.notifUnread : ""}`}>
      <div className={styles.notifDot} style={{ background: notif.read ? "transparent" : "#3b82f6" }} />
      <div className={styles.notifContent}>
        <div className={styles.notifHeader}>
          <CheckCircle size={14} color="#3b82f6" />
          <span className={styles.notifType}>Event Approved</span>
          <span className={styles.notifTime}>
            <Clock size={11} />
            {notif.time || "Recently"}
          </span>
        </div>
        <p className={styles.notifText}>{notif.message}</p>
        {notif.event_title && (
          <span className={styles.notifBadge}>{notif.event_title}</span>
        )}
      </div>
    </div>
  );
}

export default function VolunteerDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("notifications");
  const router = useRouter();

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) { router.push("/login"); return; }

      try {
        const [profileData, statsData] = await Promise.all([
          getVolunteerProfile(),
          getDashboardStats(),
        ]);
        setProfile(profileData);
        setStats(statsData);

        //  Badges: use volunteer_id from profile response
        try {
          const volunteerIdForBadges = profileData?.id || profileData?.volunteer?.volunteer_id;
          if (volunteerIdForBadges) {
            const res = await fetch(
              `http://localhost:5000/api/badges/volunteer/${volunteerIdForBadges}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.ok) {
              const data = await res.json();
              setBadges(Array.isArray(data) ? data : []);
            }
          }
        } catch {}

        // Notifications: URL for my-applications
        try {
          const res = await fetch("http://localhost:5000/volunteers/my-applications", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            const approved = (Array.isArray(data) ? data : data.applications || [])
              .filter((a) => a.status === "Approved")
              .map((a) => ({
                id: a.application_id,
                message: `You have been approved for an upcoming event. An email reminder will be sent 1 day before.`,
                event_title: a.event?.title || a.event_title,
                time: a.applied_at
                  ? new Date(a.applied_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric",
                    })
                  : "Recently",
                read: false,
              }));
            setNotifications(approved);
          }
        } catch {}

      } catch (err) {
        console.error("Dashboard error:", err);
        if (err.message?.includes("Authentication") || err.message?.includes("No access")) {
          localStorage.removeItem("access_token");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [router]);

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p>Loading your dashboard…</p>
      </div>
    );
  }

  if (!profile) return null;

 
  const name = profile.name || profile.user?.name || profile.volunteer?.name || "Volunteer";
  const email = profile.email || profile.user?.email || profile.volunteer?.email;
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className={styles.page}>

      {/* HERO HEADER */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <p className={styles.heroGreeting}>Welcome back</p>
            <h1 className={styles.heroName}>{name}</h1>
            <p className={styles.heroEmail}>{email}</p>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.notifBell}>
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className={styles.notifCount}>{notifications.length}</span>
            )}
          </div>
        </div>
      </div>

      
      <div className={styles.statsGrid}>
        <StatsCard icon={Calendar} value={stats?.activeEvents}    label="Active Events"     color="#3b82f6" />
        <StatsCard icon={Users}    value={stats?.totalVolunteers} label="Total Volunteers"  color="#8b5cf6" />
        <StatsCard icon={Zap}      value={stats?.urgentEvents}    label="Urgent Events"     color="#f59e0b" />
        <StatsCard icon={Award}    value={badges.length}          label="Badges Earned"     color="#10b981" />
      </div>

      {/* TABS */}
      <div className={styles.tabsRow}>
        <button
          className={`${styles.tab} ${activeTab === "notifications" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("notifications")}
        >
          <Bell size={15} />
          Notifications
          {notifications.length > 0 && (
            <span className={styles.tabBadge}>{notifications.length}</span>
          )}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "badges" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("badges")}
        >
          <Award size={15} />
          My Badges
          {badges.length > 0 && (
            <span className={styles.tabBadge}>{badges.length}</span>
          )}
        </button>
      </div>

      {/* NOTIFICATIONS TAB */}
      {activeTab === "notifications" && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Notifications</h2>
            <p className={styles.panelSub}>
              Email reminders are sent automatically 1 day before your approved events.
            </p>
          </div>
          {notifications.length === 0 ? (
            <div className={styles.emptyState}>
              <Bell size={36} color="#94a3b8" />
              <p>No notifications yet</p>
              <span>You will see updates here when your applications are approved.</span>
            </div>
          ) : (
            <div className={styles.notifList}>
              {notifications.map((n) => (
                <NotificationItem key={n.id} notif={n} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* BADGES TAB */}
      {activeTab === "badges" && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>My Badges</h2>
            <p className={styles.panelSub}>
              Badges are awarded for your contributions and achievements.
            </p>
          </div>
          {badges.length === 0 ? (
            <div className={styles.emptyState}>
              <Award size={36} color="#94a3b8" />
              <p>No badges yet</p>
              <span>Participate in events to start earning badges!</span>
            </div>
          ) : (
            <div className={styles.badgesGrid}>
              {badges.map((b, i) => (
                <BadgeCard key={b.badge_id || i} badge={b} />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}