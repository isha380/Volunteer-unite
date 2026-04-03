import { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, Calendar, TrendingUp } from 'lucide-react';
import './DashboardStats.css';

export default function DashboardStats() {
  const [stats, setStats] = useState({
    total_events: 0,
    total_applicants: 0,
    approved: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Active Events',
      value: stats.total_events,
      icon: Calendar,
      color: 'blue',
      trend: '+12%'
    },
    {
      title: 'Total Applications',
      value: stats.total_applicants,
      icon: Users,
      color: 'purple',
      trend: '+8%'
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'green',
      trend: '+15%'
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'orange',
      trend: '-3%'
    }
  ];

  if (loading) {
    return (
      <div className="stats-grid">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="stat-card loading">
            <div className="stat-skeleton"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="stats-grid">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-header">
              <div className="stat-icon-wrapper">
                <Icon size={24} />
              </div>
              <span className={`stat-trend ${stat.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                <TrendingUp size={14} />
                {stat.trend}
              </span>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}