from app import db
from datetime import datetime

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)  # Event title
    date = db.Column(db.String(100))  # Event date as string e.g "March 15, 2026"
    description = db.Column(db.Text)  # Full event description
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Auto timestamp

    def to_dict(self):
        # Converts model object to dictionary so it can be returned as JSON
        return {
            'id': self.id,
            'title': self.title,
            'date': self.date,
            'description': self.description,
            'created_at': self.created_at.isoformat()
        }