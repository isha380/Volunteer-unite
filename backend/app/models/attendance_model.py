from app.extensions import db
from datetime import datetime
from enum import Enum

class AttendanceStatus(Enum):
    pending = "pending"
    present = "present"
    absent = "absent"

class Attendance(db.Model):
    __tablename__ = 'attendance'

    attendance_id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('applications.application_id'), nullable=False)
    volunteer_id = db.Column(db.Integer, db.ForeignKey('volunteers.volunteer_id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.event_id'), nullable=False)
    marked_by = db.Column(db.Integer, db.ForeignKey('admins.admin_id'), nullable=False)

    status = db.Column(
        db.Enum(AttendanceStatus, values_callable=lambda x: [e.value for e in x]),
        default=AttendanceStatus.pending,
        nullable=False
    )
    remarks = db.Column(db.String(255), nullable=True)
    marked_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    volunteer = db.relationship('Volunteer', backref='attendances')
    event = db.relationship('Event', backref='attendances')
    application = db.relationship('Application', backref='attendances')
    marker = db.relationship('Admin', backref='marked_attendances')