from app import db
from datetime import datetime

class Gallery(db.Model):
    __tablename__ = 'gallery'
    
    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(500), nullable=False)  # Cloudinary image URL
    title = db.Column(db.String(255))  # Image title/caption
    category = db.Column(db.String(100))  # e.g Sports, Academics, Events
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Auto timestamp

    def to_dict(self):
        # Returns image data as JSON-friendly dictionary
        return {
            'id': self.id,
            'image_url': self.image_url,
            'title': self.title,
            'category': self.category,
            'created_at': self.created_at.isoformat()
        }