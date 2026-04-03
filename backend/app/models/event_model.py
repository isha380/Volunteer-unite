
from app.extensions import db
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
    required_skills = db.Column(db.Text)  
    created_by = db.Column(db.Integer, db.ForeignKey('admins.admin_id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='Active')  # Active, Cancelled, Completed
    urgency = db.Column(db.String(20), default='Normal')  # URGENT or Normal
    
   
    applications = db.relationship('Application', backref='event', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert event to dictionary with application count"""
        from app.models.application_model import Application
        
      
        application_count = Application.query.filter_by(event_id=self.event_id).count()
        
       
        slot_status = self._calculate_slot_status(application_count)
        
        
        skills_list = []
        if self.required_skills:
            skills_list = [skill.strip() for skill in self.required_skills.split(',')]
        
        return {
            'event_id': self.event_id,
            'title': self.title,
            'description': self.description,
            'event_date': self.event_date.isoformat() if self.event_date else None,
            'event_time': self.event_time,
            'location': self.location,
            'category': self.category,
            'max_volunteers': self.max_volunteers,
            'required_skills': skills_list,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'status': self.status,
            'urgency': self.urgency,
            'current_applications': application_count,
            'slot_status': slot_status,
            'is_urgent': self.urgency == 'URGENT',
            'is_full': application_count >= self.max_volunteers if self.max_volunteers else False
        }
    
    def _calculate_slot_status(self, application_count):
        """Calculate slot status text"""
        if not self.max_volunteers:
            return f"{application_count} volunteers"
        
        remaining = self.max_volunteers - application_count
        
        if remaining <= 0:
            return "Full"
        elif remaining <= 5:
            return "Almost Full"
        else:
            return f"{application_count}/{self.max_volunteers} volunteers"