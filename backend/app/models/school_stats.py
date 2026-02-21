from app import db
from datetime import datetime

class SchoolStat(db.Model):
    __tablename__ = 'school_stats'
    
    id = db.Column(db.Integer, primary_key=True)
    stat_key = db.Column(db.String(100), unique=True, nullable=False)  # e.g "students_count"
    stat_value = db.Column(db.String(100), nullable=False)  # e.g "1200"
    stat_label = db.Column(db.String(100))  # e.g "Students Enrolled"
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Auto updates on change

    def to_dict(self):
        # Returns stat as JSON-friendly dictionary
        return {
            'id': self.id,
            'stat_key': self.stat_key,
            'stat_value': self.stat_value,
            'stat_label': self.stat_label,
            'updated_at': self.updated_at.isoformat()
        }