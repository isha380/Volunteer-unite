

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Bell, Award, Calendar, Users, Zap,
//   CheckCircle, Clock, Star, Shield, Heart,
//   Trophy, MessageSquare, Send, ChevronDown, ChevronUp
// } from "lucide-react";
// import { getVolunteerProfile, getDashboardStats } from "../services/api";
// import styles from "./dashboard.module.css";

// function getBadgeIcon(badgeName = "") {
//   const name = badgeName.toLowerCase();
//   if (name.includes("top") || name.includes("star")) return Star;
//   if (name.includes("hero") || name.includes("shield")) return Shield;
//   if (name.includes("care") || name.includes("heart")) return Heart;
//   if (name.includes("champion") || name.includes("trophy")) return Trophy;
//   if (name.includes("fast") || name.includes("zap")) return Zap;
//   return Award;
// }

// function StatsCard({ icon: Icon, value, label, color }) {
//   return (
//     <div className={styles.statCard}>
//       <div className={styles.statIcon} style={{ background: color + "18", color }}>
//         <Icon size={20} />
//       </div>
//       <div>
//         <p className={styles.statValue}>{value ?? "—"}</p>
//         <p className={styles.statLabel}>{label}</p>
//       </div>
//     </div>
//   );
// }

// function BadgeCard({ badge }) {
//   const Icon = getBadgeIcon(badge.badge_name || badge.name || "");
//   return (
//     <div className={styles.badgeCard}>
//       <div className={styles.badgeIconWrap}>
//         <Icon size={28} />
//       </div>
//       <p className={styles.badgeName}>{badge.badge_name || badge.name}</p>
//       <p className={styles.badgeDesc}>{badge.description || "Achievement unlocked"}</p>
//       {badge.awarded_at && (
//         <p className={styles.badgeDate}>
//           {new Date(badge.awarded_at).toLocaleDateString("en-US", {
//             month: "short", day: "numeric", year: "numeric"
//           })}
//         </p>
//       )}
//     </div>
//   );
// }

// function ApprovalNotif({ notif }) {
//   return (
//     <div className={`${styles.notifItem} ${styles.notifUnread}`}>
//       <div className={styles.notifDot} style={{ background: "#3b82f6" }} />
//       <div className={styles.notifContent}>
//         <div className={styles.notifHeader}>
//           <CheckCircle size={14} color="#3b82f6" />
//           <span className={styles.notifType}>Event Approved</span>
//           <span className={styles.notifTime}>
//             <Clock size={11} />
//             {notif.time || "Recently"}
//           </span>
//         </div>
//         <p className={styles.notifText}>{notif.message}</p>
//         {notif.event_title && (
//           <span className={styles.notifBadge}>{notif.event_title}</span>
//         )}
//       </div>
//     </div>
//   );
// }

// function AdminMessageItem({ msg, token, onReplySent }) {
//   const [showReply, setShowReply] = useState(false);
//   const [reply, setReply]         = useState("");
//   const [sending, setSending]     = useState(false);
//   const [sent, setSent]           = useState(false);

//   const handleReply = async () => {
//     if (!reply.trim()) return;
//     setSending(true);
//     try {
//       const res = await fetch("http://localhost:5000/api/notifications/reply", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ message: reply.trim() }),
//       });
//       if (res.ok) {
//         setSent(true);
//         setReply("");
//         setShowReply(false);
//         if (onReplySent) onReplySent();
//       }
//     } catch {}
//     setSending(false);
//   };

//   return (
//     <div className={`${styles.notifItem} ${styles.adminMsgItem}`}>
//       <div className={styles.notifDot} style={{ background: "#8b5cf6" }} />
//       <div className={styles.notifContent}>
//         <div className={styles.notifHeader}>
//           <MessageSquare size={14} color="#8b5cf6" />
//           <span className={styles.notifTypeAdmin}>Message from Admin</span>
//           <span className={styles.notifTime}>
//             <Clock size={11} />
//             {msg.sent_at
//               ? new Date(msg.sent_at).toLocaleDateString("en-US", {
//                   month: "short", day: "numeric",
//                 })
//               : "Recently"}
//           </span>
//         </div>
//         <p className={styles.notifText}>{msg.message}</p>

//         {sent ? (
//           <p className={styles.replySentMsg}>
//             <CheckCircle size={13} /> Reply sent!
//           </p>
//         ) : (
//           <button
//             className={styles.replyToggle}
//             onClick={() => setShowReply(!showReply)}
//           >
//             {showReply ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
//             {showReply ? "Cancel" : "Reply"}
//           </button>
//         )}

//         {showReply && !sent && (
//           <div className={styles.replyBox}>
//             <textarea
//               className={styles.replyTextarea}
//               placeholder="Type your reply..."
//               value={reply}
//               onChange={(e) => setReply(e.target.value)}
//               rows={3}
//             />
//             <button
//               className={styles.replyBtn}
//               onClick={handleReply}
//               disabled={!reply.trim() || sending}
//             >
//               <Send size={13} />
//               {sending ? "Sending..." : "Send Reply"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function SentMessageItem({ msg }) {
//   return (
//     <div className={`${styles.notifItem} ${styles.sentMsgItem}`}>
//       <div className={styles.notifDot} style={{ background: "#10b981" }} />
//       <div className={styles.notifContent}>
//         <div className={styles.notifHeader}>
//           <Send size={14} color="#10b981" />
//           <span className={styles.notifTypeSent}>My Reply to Admin</span>
//           <span className={styles.notifTime}>
//             <Clock size={11} />
//             {msg.sent_at
//               ? new Date(msg.sent_at).toLocaleDateString("en-US", {
//                   month: "short", day: "numeric",
//                 })
//               : "Recently"}
//           </span>
//         </div>
//         <p className={styles.notifText}>{msg.message}</p>
//         <span className={styles.sentBadge}>
//           <Send size={10} /> Sent
//         </span>
//       </div>
//     </div>
//   );
// }

// export default function DashboardPage() {
//   const [profile, setProfile]             = useState(null);
//   const [stats, setStats]                 = useState(null);
//   const [badges, setBadges]               = useState([]);
//   const [approvalNotifs, setApprovalNotifs] = useState([]);
//   const [adminMessages, setAdminMessages] = useState([]);
//   const [volunteerSent, setVolunteerSent] = useState([]);
//   const [loading, setLoading]             = useState(true);
//   const [activeTab, setActiveTab]         = useState("notifications");
//   const router = useRouter();

//   const token = typeof window !== "undefined"
//     ? localStorage.getItem("access_token")
//     : null;

//   const fetchAdminMessages = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/notifications/my-messages", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setAdminMessages(Array.isArray(data) ? data : []);
//       }
//     } catch {}
//   };

//   const fetchVolunteerSent = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/notifications/my-sent", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setVolunteerSent(Array.isArray(data) ? data : []);
//       }
//     } catch {}
//   };

//   useEffect(() => {
//     const fetchAll = async () => {
//       if (!token) { router.push("/login"); return; }

//       try {
//         const [profileData, statsData] = await Promise.all([
//           getVolunteerProfile(),
//           getDashboardStats(),
//         ]);
//         setProfile(profileData);
//         setStats(statsData);

//         // Fetch badges
//         try {
//           const volunteerIdForBadges = profileData?.id || profileData?.volunteer?.volunteer_id;
//           if (volunteerIdForBadges) {
//             const res = await fetch(
//               `http://localhost:5000/api/badges/volunteer/${volunteerIdForBadges}`,
//               { headers: { Authorization: `Bearer ${token}` } }
//             );
//             if (res.ok) {
//               const data = await res.json();
//               setBadges(Array.isArray(data) ? data : []);
//             }
//           }
//         } catch {}

//         // Fetch approved applications as notifications
//         try {
//           const res = await fetch("http://localhost:5000/volunteers/my-applications", {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           if (res.ok) {
//             const data = await res.json();
//             const approved = (Array.isArray(data) ? data : data.applications || [])
//               .filter((a) => a.status === "Approved")
//               .map((a) => ({
//                 id: a.application_id,
//                 message: `You have been approved for an upcoming event. An email reminder will be sent 1 day before.`,
//                 event_title: a.event?.title || a.event_title,
//                 time: a.applied_at
//                   ? new Date(a.applied_at).toLocaleDateString("en-US", {
//                       month: "short", day: "numeric",
//                     })
//                   : "Recently",
//               }));
//             setApprovalNotifs(approved);
//           }
//         } catch {}

//         // Fetch admin messages received
//         await fetchAdminMessages();

//         // Fetch volunteer's own sent replies
//         await fetchVolunteerSent();

//       } catch (err) {
//         console.error("Dashboard error:", err);
//         if (err.message?.includes("Authentication") || err.message?.includes("No access")) {
//           localStorage.removeItem("access_token");
//           router.push("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//   }, [router]);

//   const totalNotifs = approvalNotifs.length + adminMessages.length + volunteerSent.length;

//   if (loading) {
//     return (
//       <div className={styles.loadingWrap}>
//         <div className={styles.spinner} />
//         <p>Loading your dashboard…</p>
//       </div>
//     );
//   }

//   if (!profile) return null;

//   const name  = profile.name  || profile.user?.name  || profile.volunteer?.name  || "Volunteer";
//   const email = profile.email || profile.user?.email || profile.volunteer?.email;
//   const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

//   return (
//     <div className={styles.page}>

//       {/* HERO */}
//       <div className={styles.hero}>
//         <div className={styles.heroLeft}>
//           <div className={styles.avatar}>{initials}</div>
//           <div>
//             <p className={styles.heroGreeting}>Welcome back</p>
//             <h1 className={styles.heroName}>{name}</h1>
//             <p className={styles.heroEmail}>{email}</p>
//           </div>
//         </div>
//         <div className={styles.heroRight}>
//           <div className={styles.notifBell}>
//             <Bell size={20} />
//             {totalNotifs > 0 && (
//               <span className={styles.notifCount}>{totalNotifs}</span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* STATS */}
//       <div className={styles.statsGrid}>
//         <StatsCard icon={Calendar} value={stats?.activeEvents}    label="Active Events"    color="#3b82f6" />
//         <StatsCard icon={Users}    value={stats?.totalVolunteers} label="Total Volunteers" color="#8b5cf6" />
//         <StatsCard icon={Zap}      value={stats?.urgentEvents}    label="Urgent Events"    color="#f59e0b" />
//         <StatsCard icon={Award}    value={badges.length}          label="Badges Earned"    color="#10b981" />
//       </div>

//       {/* TABS */}
//       <div className={styles.tabsRow}>
//         <button
//           className={`${styles.tab} ${activeTab === "notifications" ? styles.tabActive : ""}`}
//           onClick={() => setActiveTab("notifications")}
//         >
//           <Bell size={15} />
//           Notifications
//           {totalNotifs > 0 && (
//             <span className={styles.tabBadge}>{totalNotifs}</span>
//           )}
//         </button>
//         <button
//           className={`${styles.tab} ${activeTab === "badges" ? styles.tabActive : ""}`}
//           onClick={() => setActiveTab("badges")}
//         >
//           <Award size={15} />
//           My Badges
//           {badges.length > 0 && (
//             <span className={styles.tabBadge}>{badges.length}</span>
//           )}
//         </button>
//       </div>

//       {/* NOTIFICATIONS TAB */}
//       {activeTab === "notifications" && (
//         <div className={styles.panel}>
//           <div className={styles.panelHeader}>
//             <h2 className={styles.panelTitle}>Notifications</h2>
//             <p className={styles.panelSub}>
//               Email reminders are sent 1 day before approved events. Admin messages and your replies appear below.
//             </p>
//           </div>

//           {totalNotifs === 0 ? (
//             <div className={styles.emptyState}>
//               <Bell size={36} color="#94a3b8" />
//               <p>No notifications yet</p>
//               <span>Approval updates and admin messages will appear here.</span>
//             </div>
//           ) : (
//             <div className={styles.notifList}>

//               {/* Section: Event Approvals */}
//               {approvalNotifs.length > 0 && (
//                 <>
//                   <div className={styles.sectionLabel}>
//                     <CheckCircle size={13} color="#3b82f6" /> Event Approvals
//                   </div>
//                   {approvalNotifs.map((n) => (
//                     <ApprovalNotif key={n.id} notif={n} />
//                   ))}
//                 </>
//               )}

//               {/* Section: Messages from Admin */}
//               {adminMessages.length > 0 && (
//                 <>
//                   <div className={styles.sectionLabel}>
//                     <MessageSquare size={13} color="#8b5cf6" /> Messages from Admin
//                   </div>
//                   {adminMessages.map((msg) => (
//                     <AdminMessageItem
//                       key={msg.notification_id}
//                       msg={msg}
//                       token={token}
//                       onReplySent={() => {
//                         fetchAdminMessages();
//                         fetchVolunteerSent();
//                       }}
//                     />
//                   ))}
//                 </>
//               )}

//               {/* Section: My Sent Replies */}
//               {volunteerSent.length > 0 && (
//                 <>
//                   <div className={styles.sectionLabel}>
//                     <Send size={13} color="#10b981" /> My Replies to Admin
//                   </div>
//                   {volunteerSent.map((msg) => (
//                     <SentMessageItem key={msg.notification_id} msg={msg} />
//                   ))}
//                 </>
//               )}

//             </div>
//           )}
//         </div>
//       )}

//       {/* BADGES TAB */}
//       {activeTab === "badges" && (
//         <div className={styles.panel}>
//           <div className={styles.panelHeader}>
//             <h2 className={styles.panelTitle}>My Badges</h2>
//             <p className={styles.panelSub}>
//               Badges are awarded for your contributions and achievements.
//             </p>
//           </div>
//           {badges.length === 0 ? (
//             <div className={styles.emptyState}>
//               <Award size={36} color="#94a3b8" />
//               <p>No badges yet</p>
//               <span>Participate in events to start earning badges!</span>
//             </div>
//           ) : (
//             <div className={styles.badgesGrid}>
//               {badges.map((b, i) => (
//                 <BadgeCard key={b.badge_id || i} badge={b} />
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, Award, Calendar, Users, Zap,
  CheckCircle, Clock, Star, Shield, Heart,
  Trophy, MessageSquare, Send, ChevronDown, ChevronUp
} from "lucide-react";
import { getVolunteerProfile, getDashboardStats } from "../services/api";
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

function ApprovalNotif({ notif }) {
  return (
    <div className={`${styles.notifItem} ${styles.notifUnread}`}>
      <div className={styles.notifDot} style={{ background: "#3b82f6" }} />
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

function AdminMessageItem({ msg, token, onReplySent }) {
  const [showReply, setShowReply] = useState(false);
  const [reply, setReply]         = useState("");
  const [sending, setSending]     = useState(false);
  const [sent, setSent]           = useState(false);

  const handleReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await fetch("http://localhost:5000/api/notifications/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: reply.trim() }),
      });
      if (res.ok) {
        setSent(true);
        setReply("");
        setShowReply(false);
        if (onReplySent) onReplySent();
      }
    } catch {}
    setSending(false);
  };

  return (
    <div className={`${styles.notifItem} ${styles.adminMsgItem}`}>
      <div className={styles.notifDot} style={{ background: "#8b5cf6" }} />
      <div className={styles.notifContent}>
        <div className={styles.notifHeader}>
          <MessageSquare size={14} color="#8b5cf6" />
          <span className={styles.notifTypeAdmin}>Message from Admin</span>
          <span className={styles.notifTime}>
            <Clock size={11} />
            {msg.sent_at
              ? new Date(msg.sent_at).toLocaleDateString("en-US", {
                  month: "short", day: "numeric",
                })
              : "Recently"}
          </span>
        </div>
        <p className={styles.notifText}>{msg.message}</p>
        {sent ? (
          <p className={styles.replySentMsg}>
            <CheckCircle size={13} /> Reply sent!
          </p>
        ) : (
          <button
            className={styles.replyToggle}
            onClick={() => setShowReply(!showReply)}
          >
            {showReply ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {showReply ? "Cancel" : "Reply"}
          </button>
        )}
        {showReply && !sent && (
          <div className={styles.replyBox}>
            <textarea
              className={styles.replyTextarea}
              placeholder="Type your reply..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={3}
            />
            <button
              className={styles.replyBtn}
              onClick={handleReply}
              disabled={!reply.trim() || sending}
            >
              <Send size={13} />
              {sending ? "Sending..." : "Send Reply"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [profile, setProfile]               = useState(null);
  const [stats, setStats]                   = useState(null);
  const [badges, setBadges]                 = useState([]);
  const [approvalNotifs, setApprovalNotifs] = useState([]);
  const [adminMessages, setAdminMessages]   = useState([]);
  const [volunteerSent, setVolunteerSent]   = useState([]);
  const [newMessage, setNewMessage]         = useState("");
  const [sendingNew, setSendingNew]         = useState(false);
  const [newMsgSuccess, setNewMsgSuccess]   = useState("");
  const [loading, setLoading]               = useState(true);
  const [activeTab, setActiveTab]           = useState("notifications");
  const router = useRouter();

  const token = typeof window !== "undefined"
    ? localStorage.getItem("access_token")
    : null;

  const fetchAdminMessages = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications/my-messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAdminMessages(Array.isArray(data) ? data : []);
      }
    } catch {}
  };

  const fetchVolunteerSent = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications/my-sent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setVolunteerSent(Array.isArray(data) ? data : []);
      }
    } catch {}
  };

  useEffect(() => {
    const fetchAll = async () => {
      if (!token) { router.push("/login"); return; }
      try {
        const [profileData, statsData] = await Promise.all([
          getVolunteerProfile(),
          getDashboardStats(),
        ]);
        setProfile(profileData);
        setStats(statsData);

        // Badges
        try {
          const vid = profileData?.id || profileData?.volunteer?.volunteer_id;
          if (vid) {
            const res = await fetch(
              `http://localhost:5000/api/badges/volunteer/${vid}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.ok) setBadges(await res.json());
          }
        } catch {}

        // Approved applications
        try {
          const res = await fetch("http://localhost:5000/volunteers/my-applications", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            const approved = (Array.isArray(data) ? data : [])
              .filter((a) => a.status === "Approved")
              .map((a) => ({
                id: a.application_id,
                message: `You have been approved for an upcoming event. An email reminder will be sent 1 day before.`,
                event_title: a.event?.title || a.event_title,
                time: a.applied_at
                  ? new Date(a.applied_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : "Recently",
              }));
            setApprovalNotifs(approved);
          }
        } catch {}

        await fetchAdminMessages();
        await fetchVolunteerSent();

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

  const handleSendNewMessage = async () => {
    if (!newMessage.trim()) return;
    setSendingNew(true);
    try {
      const res = await fetch("http://localhost:5000/api/notifications/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newMessage.trim() }),
      });
      if (res.ok) {
        setNewMsgSuccess("Message sent to admin!");
        setNewMessage("");
        await fetchVolunteerSent();
        setTimeout(() => setNewMsgSuccess(""), 3000);
      }
    } catch {}
    setSendingNew(false);
  };

  const totalNotifs = approvalNotifs.length + adminMessages.length;

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p>Loading your dashboard…</p>
      </div>
    );
  }

  if (!profile) return null;

  const name     = profile.name  || profile.user?.name  || profile.volunteer?.name  || "Volunteer";
  const email    = profile.email || profile.user?.email || profile.volunteer?.email;
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className={styles.page}>

      {/* HERO */}
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
            {totalNotifs > 0 && (
              <span className={styles.notifCount}>{totalNotifs}</span>
            )}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className={styles.statsGrid}>
        <StatsCard icon={Calendar} value={stats?.activeEvents}    label="Active Events"    color="#3b82f6" />
        <StatsCard icon={Users}    value={stats?.totalVolunteers} label="Total Volunteers" color="#8b5cf6" />
        <StatsCard icon={Zap}      value={stats?.urgentEvents}    label="Urgent Events"    color="#f59e0b" />
        <StatsCard icon={Award}    value={badges.length}          label="Badges Earned"    color="#10b981" />
      </div>

      {/* 3 TABS */}
      <div className={styles.tabsRow}>
        <button
          className={`${styles.tab} ${activeTab === "notifications" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("notifications")}
        >
          <Bell size={15} />
          Notifications
          {totalNotifs > 0 && (
            <span className={styles.tabBadge}>{totalNotifs}</span>
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
        <button
          className={`${styles.tab} ${activeTab === "message" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("message")}
        >
          <MessageSquare size={15} />
          Message Admin
          {volunteerSent.length > 0 && (
            <span className={styles.tabBadge}>{volunteerSent.length}</span>
          )}
        </button>
      </div>

      {/* NOTIFICATIONS TAB */}
      {activeTab === "notifications" && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Notifications</h2>
            <p className={styles.panelSub}>
              Email reminders are sent 1 day before approved events. Admin messages appear below.
            </p>
          </div>
          {totalNotifs === 0 ? (
            <div className={styles.emptyState}>
              <Bell size={36} color="#94a3b8" />
              <p>No notifications yet</p>
              <span>Approval updates and admin messages will appear here.</span>
            </div>
          ) : (
            <div className={styles.notifList}>
              {approvalNotifs.length > 0 && (
                <>
                  <div className={styles.sectionLabel}>
                    <CheckCircle size={13} color="#3b82f6" /> Event Approvals
                  </div>
                  {approvalNotifs.map((n) => (
                    <ApprovalNotif key={n.id} notif={n} />
                  ))}
                </>
              )}
              {adminMessages.length > 0 && (
                <>
                  <div className={styles.sectionLabel}>
                    <MessageSquare size={13} color="#8b5cf6" /> Messages from Admin
                  </div>
                  {adminMessages.map((msg) => (
                    <AdminMessageItem
                      key={msg.notification_id}
                      msg={msg}
                      token={token}
                      onReplySent={() => {
                        fetchAdminMessages();
                        fetchVolunteerSent();
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* BADGES TAB */}
      {activeTab === "badges" && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>My Badges</h2>
            <p className={styles.panelSub}>Badges are awarded for your contributions and achievements.</p>
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

      {/* MESSAGE ADMIN TAB */}
      {activeTab === "message" && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Message Admin</h2>
            <p className={styles.panelSub}>
              Send a message or question to the admin. Your sent messages appear below.
            </p>
          </div>

          {/* New message form */}
          <div className={styles.msgForm}>
            <textarea
              className={styles.msgTextarea}
              placeholder="Type your message to admin here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={4}
            />
            {newMsgSuccess && (
              <div className={styles.successMsg}>
                <CheckCircle size={15} /> {newMsgSuccess}
              </div>
            )}
            <button
              className={styles.msgSendBtn}
              onClick={handleSendNewMessage}
              disabled={!newMessage.trim() || sendingNew}
            >
              <Send size={15} />
              {sendingNew ? "Sending..." : "Send to Admin"}
            </button>
          </div>

          {/* Sent messages history */}
          {volunteerSent.length > 0 && (
            <>
              <div className={styles.sectionLabel} style={{ marginTop: "0.5rem" }}>
                <Send size={13} color="#10b981" /> My Sent Messages
              </div>
              <div className={styles.notifList}>
                {volunteerSent.map((msg) => (
                  <div key={msg.notification_id} className={`${styles.notifItem} ${styles.sentMsgItem}`}>
                    <div className={styles.notifDot} style={{ background: "#10b981" }} />
                    <div className={styles.notifContent}>
                      <div className={styles.notifHeader}>
                        <Send size={14} color="#10b981" />
                        <span className={styles.notifTypeSent}>My Message to Admin</span>
                        <span className={styles.notifTime}>
                          <Clock size={11} />
                          {msg.sent_at
                            ? new Date(msg.sent_at).toLocaleDateString("en-US", {
                                month: "short", day: "numeric",
                              })
                            : "Recently"}
                        </span>
                      </div>
                      <p className={styles.notifText}>{msg.message}</p>
                      <span className={styles.sentBadge}>
                        <Send size={10} /> Sent
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {volunteerSent.length === 0 && (
            <div className={styles.emptyState}>
              <MessageSquare size={36} color="#94a3b8" />
              <p>No messages sent yet</p>
              <span>Your messages to admin will appear here.</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
}