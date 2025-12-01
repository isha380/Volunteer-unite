


from app import db
from datetime import datetime

class Volunteer(db.Model):
    __tablename__ = 'volunteers'

    volunteer_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    skills = db.Column(db.Text, nullable=False)
    availability = db.Column(db.String(200))
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    profile = db.Column(db.String(255))
    role = db.Column(db.String(100), default='volunteer')
    password_hash = db.Column(db.String(255), nullable=False)
