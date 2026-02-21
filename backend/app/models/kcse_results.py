from app import db
from datetime import datetime

class KcseResult(db.Model):
    __tablename__ = 'kcse_results'
    
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.String(10), nullable=False)  # Exam year e.g "2025"
    mean_grade = db.Column(db.String(10))  # Mean grade e.g "A-"
    university_entry_percentage = db.Column(db.String(10))  # e.g "92%"
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Auto timestamp

    def to_dict(self):
        # Returns KCSE result as JSON-friendly dictionary
        return {
            'id': self.id,
            'year': self.year,
            'mean_grade': self.mean_grade,
            'university_entry_percentage': self.university_entry_percentage,
            'created_at': self.created_at.isoformat()
        }