
from app.extensions import db
from datetime import datetime
class EventVolunteerMatch(db.Model):
    __tablename__ = 'event_volunteer_match'

    id = db.Column(db.Integer, primary_key=True)
    volunteer_id = db.Column(db.Integer, db.ForeignKey('volunteers.volunteer_id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.event_id'), nullable=False)

    keyword_score = db.Column(db.Integer, nullable=False)
    availability_bonus = db.Column(db.Integer, default=0)
    match_score = db.Column(db.Integer, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
