from app.extensions import db
from datetime import datetime

class Badge(db.Model):
    __tablename__ = 'badges'
    
    badge_id = db.Column(db.Integer, primary_key=True)
    badge_name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text)
    criteria_events = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class VolunteerBadge(db.Model):
    __tablename__ = 'volunteer_badges'
    
    id = db.Column(db.Integer, primary_key=True)
    volunteer_id = db.Column(db.Integer, nullable=False)
    badge_id = db.Column(db.Integer, db.ForeignKey('badges.badge_id', ondelete='CASCADE'))
    awarded_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('volunteer_id', 'badge_id'),
    )