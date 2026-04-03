'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import { Users, CalendarDays, ClipboardCheck, Trophy, TrendingUp , Award, Star, Gem } from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

const COLORS = ["#1a56db", "#76a9fa", "#a4cafe", "#c3ddfd", "#e1effe"];

export default function AttendanceDashboard() {
  const [stats, setStats] = useState(null);
  const [badges, setBadges] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/dashboard/stats")
      .then(res => { setStats(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
    axios.get("http://localhost:5000/api/dashboard/badges")
    .then(res => setBadges(res.data))
    .catch(err => console.error(err));
    }, []);

  if (loading) return (
    <div style={{ padding: "3rem", textAlign: "center", color: "#1a56db", fontFamily: "Segoe UI, sans-serif" }}>
      Loading...
    </div>
  );

  if (!stats) return (
    <div style={{ padding: "3rem", textAlign: "center", color: "#ef4444", fontFamily: "Segoe UI, sans-serif" }}>
      Failed to load stats.
    </div>
  );

  return (
    <div style={{ padding: "2rem", fontFamily: "Segoe UI, sans-serif", color: "#1e3a5f", background: "#f0f4ff", minHeight: "100vh" }}>

      {/* Page Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>Attendance Overview</h2>
        <p style={{ color: "#6b7280", margin: "4px 0 0", fontSize: "0.9rem" }}>Track volunteer attendance and participation</p>
      </div>

      {/* Score Cards */}
      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <ScoreCard label="Total Volunteers" value={stats.total_volunteers} Icon={Users} color="#1a56db" />
        <ScoreCard label="Total Events" value={stats.total_events} Icon={CalendarDays} color="#0e9f6e" />
        <ScoreCard label="Total Attendance" value={stats.total_attendance} Icon={ClipboardCheck} color="#7e3af2" />
      </div>

      {/* Charts Row */}
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>

        {/* Donut Chart */}
        <div style={cardStyle}>
          <div style={cardHeader}>
            <TrendingUp size={18} color="#1a56db" />
            <div>
              <h3 style={cardTitle}>Event Status Distribution</h3>
              <p style={cardSub}>Overview of event statuses</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.event_status_distribution}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {stats.event_status_distribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div style={{ ...cardStyle, flex: 2 }}>
          <div style={cardHeader}>
            <TrendingUp size={18} color="#1a56db" />
            <div>
              <h3 style={cardTitle}>Monthly Volunteer Participation</h3>
              <p style={cardSub}>Number of volunteers per month</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.monthly_participation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0eaf5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}`, "volunteers"]} />
              <Bar dataKey="volunteers" fill="#1a56db" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Badge Criteria Section */}
 {badges.length > 0 && (
  <div style={{ ...cardStyle, marginBottom: "1.5rem" }}>
    <div style={cardHeader}>
      <Award size={18} color="#1a56db" />
      <div>
        <h3 style={cardTitle}>Badge Criteria</h3>
        <p style={cardSub}>Badges awarded based on events attended</p>
      </div>
    </div>
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
      {badges.map((badge, i) => {
        const meta = [
    
          { Icon: Award, color: "#cf875a", bg: "#fdf6ee", border: "#d7974f", iconBg: "#fffae6" },  
          { Icon: Star,  color: "#1a56db", bg: "#eff6ff", border: "#93c5fd", iconBg: "#dbeafe" },  
          { Icon: Gem,   color: "#b45309", bg: "#fffbeb", border: "#f7b100", iconBg: "#fef3c7" }, 
        ];
        const m = meta[i] || { Icon: Trophy, color: "#1a56db", bg: "#ebf3ff", border: "#bfdbfe", iconBg: "#dbeafe" };
        const { Icon } = m;
        return (
          <div key={i} style={{
            flex: 1, minWidth: "200px",
            background: m.bg,
            border: `1.5px solid ${m.border}`,
            borderRadius: "14px",
            padding: "1.25rem 1.5rem",
            display: "flex", alignItems: "center", gap: "1rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>
            <div style={{
              background: m.iconBg,
              borderRadius: "12px",
              padding: "0.75rem",
              display: "flex",
              flexShrink: 0,
              border: `1px solid ${m.border}`
            }}>
              <Icon size={24} color={m.color} strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "1rem", color: m.color }}>
                {badge.badge_name}
              </div>
              <div style={{ fontSize: "0.82rem", color: "#6b7280", margin: "2px 0" }}>
                {badge.description}
              </div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "6px",
                background: "#fff",
                border: `1px solid ${m.border}`,
                borderRadius: "999px",
                padding: "2px 10px",
                fontSize: "0.78rem",
                fontWeight: "600",
                color: m.color
              }}>
                <CalendarDays size={11} color={m.color} />
                {badge.criteria_events} events required
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
 )}
      {/* Top Volunteers Table */}
      <div style={cardStyle}>
        <div style={cardHeader}>
          <Trophy size={18} color="#1a56db" />
          <div>
            <h3 style={cardTitle}>Top Volunteers</h3>
            <p style={cardSub}>Most present attendance</p>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ background: "#ebf3ff" }}>
              <th style={thStyle}>Rank</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Events Attended</th>
            </tr>
          </thead>
          <tbody>
            {stats.top_volunteers.map((v, i) => (
              <tr key={v.volunteer_id} style={{ borderBottom: "1px solid #dbeafe" }}>
                <td style={tdStyle}>
                  <span style={{
                    background: i === 0 ? "#fef3c7" : i === 1 ? "#f3f4f6" : "#fff7ed",
                    color: i === 0 ? "#d97706" : i === 1 ? "#6b7280" : "#ea580c",
                    fontWeight: "700", padding: "2px 10px", borderRadius: "999px", fontSize: "0.85rem"
                  }}>
                    #{i + 1}
                  </span>
                </td>
                <td style={tdStyle}>{v.name}</td>
                <td style={tdStyle}>
                  <span style={{ background: "#ebf3ff", color: "#1a56db", padding: "2px 10px", borderRadius: "999px", fontSize: "0.85rem", fontWeight: "600" }}>
                    {v.present_count} events
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ScoreCard({ label, value, Icon, color }) {
  return (
    <div style={{
      flex: 1, minWidth: "180px", background: "#fff",
      border: "1px solid #dbeafe", borderRadius: "12px",
      padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem",
      boxShadow: "0 2px 8px rgba(26,86,219,0.07)"
    }}>
      <div style={{ background: `${color}18`, borderRadius: "10px", padding: "0.75rem", display: "flex" }}>
        <Icon size={24} color={color} />
      </div>
      <div>
        <div style={{ fontSize: "1.8rem", fontWeight: "700", color: color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "4px" }}>{label}</div>
      </div>
    </div>
  );
}

const cardStyle = {
  flex: 1, minWidth: "300px", background: "#fff",
  border: "1px solid #dbeafe", borderRadius: "12px",
  padding: "1.5rem", boxShadow: "0 2px 8px rgba(26,86,219,0.07)"
};
const cardHeader = { display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.5rem" };
const cardTitle = { margin: "0 0 2px", fontSize: "1rem", fontWeight: "600" };
const cardSub = { margin: 0, fontSize: "0.82rem", color: "#6b7280" };
const thStyle = { padding: "0.75rem 1rem", textAlign: "left", fontWeight: "600", color: "#1e3a5f", fontSize: "0.9rem" };
const tdStyle = { padding: "0.75rem 1rem", color: "#374151", fontSize: "0.9rem" };
