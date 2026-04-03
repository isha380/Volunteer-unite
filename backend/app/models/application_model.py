# from app.extensions import db
# from datetime import datetime

# class Application(db.Model):
#     __tablename__ = 'applications'
#     application_id = db.Column(db.Integer, primary_key=True)
#     volunteer_id = db.Column(db.Integer, db.ForeignKey('volunteers.volunteer_id'), nullable=False)
#     event_id = db.Column(db.Integer, db.ForeignKey('events.event_id'), nullable=False)
#     status = db.Column(db.String(20), default='Pending', nullable=False)  # Pending, Approved, Rejected
#     match_score = db.Column(db.Float, nullable=True)
#     assigned_by_greedy = db.Column(db.Boolean, default=False)
#     confirmation_status = db.Column(db.String(20), default='Pending')  # Pending, Confirmed, Declined
#     confirmed_at = db.Column(db.DateTime)
#     applied_at = db.Column(db.DateTime, default=datetime.utcnow)
#     gender = db.Column(db.String(10), nullable=True)
#     volunteer = db.relationship('Volunteer', backref='applications')

from app.extensions import db
from datetime import datetime

class Application(db.Model):
    __tablename__ = 'applications'

    application_id = db.Column(db.Integer, primary_key=True)
    volunteer_id = db.Column(db.Integer, db.ForeignKey('volunteers.volunteer_id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.event_id'), nullable=False)

    status = db.Column(db.String(20), default='Pending', nullable=False)
    confirmation_status = db.Column(db.String(20), default='Pending')

    is_shortlisted = db.Column(db.Boolean, default=False, nullable=False)

    confirmed_at = db.Column(db.DateTime)
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)

    gender = db.Column(db.String(10), nullable=True)

    volunteer = db.relationship('Volunteer', backref='applications')
