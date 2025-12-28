import "./StatsCard.css";

export default function StatsCard({ icon, value, label }) {
  return (
    <div className="stats-card">
      <div className="stats-icon">
        {icon}
      </div>

      <div className="stats-info">
        <h2>{value}</h2>
        <p>{label}</p>
      </div>
    </div>
  );
}
