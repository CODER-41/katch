from app import db
from datetime import datetime

class Alumni(db.Model):
    __tablename__ = 'alumni'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)  # Alumni full name
    achievement = db.Column(db.String(255))  # Short achievement title e.g "Former Vice President"
    description = db.Column(db.Text)  # Longer description about the alumni
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Auto timestamp

    def to_dict(self):
        # Returns alumni data as JSON-friendly dictionary
        return {
            'id': self.id,
            'name': self.name,
            'achievement': self.achievement,
            'description': self.description,
            'created_at': self.created_at.isoformat()
        }