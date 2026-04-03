from app import db
from datetime import datetime

class VolunteerBadge(db.Model):
    __tablename__ = 'volunteer_badges'

    id = db.Column(db.Integer, primary_key=True)
    volunteer_id = db.Column(db.Integer, db.ForeignKey('volunteer.volunteer_id'))
    badge_id = db.Column(db.Integer, db.ForeignKey('badges.badge_id'))
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow)