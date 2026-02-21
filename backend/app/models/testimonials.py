from app import db
from datetime import datetime

class Testimonial(db.Model):
    __tablename__ = 'testimonials'
    
    id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(120), nullable=False)  # Student full name
    year = db.Column(db.String(50))  # e.g "Form 4R" or "Class of 2024"
    quote = db.Column(db.Text, nullable=False)  # The testimonial quote
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Auto timestamp

    def to_dict(self):
        # Returns testimonial as JSON-friendly dictionary
        return {
            'id': self.id,
            'student_name': self.student_name,
            'year': self.year,
            'quote': self.quote,
            'created_at': self.created_at.isoformat()
        }