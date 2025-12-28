import React from "react";
import "./StatsCard.css";

const StatsCard = ({ icon, number, label }) => {
  return (
    <div className="stats-card">
      <div className="stats-icon">{icon}</div>
      <h2>{number}</h2>
      <p>{label}</p>
    </div>
  );
};

export default StatsCard;
