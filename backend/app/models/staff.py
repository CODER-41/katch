from app import db
from datetime import datetime

class Staff(db.Model):
    __tablename__ = 'staff'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    photo_url = db.Column(db.String(500))
    subject = db.Column(db.String(120))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    role = db.Column(db.String(120))
    is_leadership = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'photo_url': self.photo_url,
            'subject': self.subject,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'is_leadership': self.is_leadership,
            'created_at': self.created_at.isoformat()
        }
