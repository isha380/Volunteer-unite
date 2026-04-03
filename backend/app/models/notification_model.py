from app.extensions import db
from datetime import datetime

class Notification(db.Model):
    __tablename__ = 'notifications'

    notification_id       = db.Column(db.Integer, primary_key=True)
    volunteer_id          = db.Column(db.Integer, db.ForeignKey('volunteers.volunteer_id'), nullable=False)
    related_application_id = db.Column(db.Integer, nullable=True)
    message               = db.Column(db.Text, nullable=False)
    type                  = db.Column(db.String(20), default='message')
    action_required       = db.Column(db.Boolean, default=False)
    status                = db.Column(db.String(10), default='unread')
    sent_at               = db.Column(db.DateTime, default=datetime.utcnow)
    sender                = db.Column(db.String(10), default='admin')  # 'admin' or 'volunteer'
    is_read               = db.Column(db.Boolean, default=False)

    
    volunteer = db.relationship('Volunteer', backref='notifications')

    def to_dict(self):
        return {
            'notification_id':        self.notification_id,
            'volunteer_id':           self.volunteer_id,
            'related_application_id': self.related_application_id,
            'message':                self.message,
            'type':                   self.type,
            'action_required':        self.action_required,
            'status':                 self.status,
            'sent_at':                self.sent_at.isoformat() if self.sent_at else None,
            'sender':                 self.sender,
            'is_read':                self.is_read,
        }