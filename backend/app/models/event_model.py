
from app import db
from datetime import datetime

class Event(db.Model):
    __tablename__ = 'events'
    
    event_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    event_date = db.Column(db.Date, nullable=False)
    event_time = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(100))
    max_volunteers = db.Column(db.Integer, nullable=False)
    required_skills = db.Column(db.Text)  # Store as comma-separated or JSON
    created_by = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='active')  # active, cancelled, completed
    
    # Relationship (if you have a User model)
    # creator = db.relationship('User', backref='events_created')
    
    def to_dict(self):
        return {
            'event_id': self.event_id,
            'title': self.title,
            'description': self.description,
            'event_date': self.event_date.isoformat() if self.event_date else None,
            'event_time': self.event_time,
            'location': self.location,
            'category': self.category,
            'max_volunteers': self.max_volunteers,
            'required_skills': self.required_skills,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'status': self.status
        }