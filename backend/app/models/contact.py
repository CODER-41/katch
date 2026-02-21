from app import db
from datetime import datetime

class ContactSubmission(db.Model):
    __tablename__ = 'contact_submissions'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)  # Sender's name
    email = db.Column(db.String(120), nullable=False)  # Sender's email
    phone = db.Column(db.String(20))  # Optional phone number
    subject = db.Column(db.String(255))  # Message subject
    message = db.Column(db.Text, nullable=False)  # Message body
    is_read = db.Column(db.Boolean, default=False)  # Admin marks as read
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Auto timestamp

    def to_dict(self):
        # Returns contact submission as JSON-friendly dictionary
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'subject': self.subject,
            'message': self.message,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat()
        }