from app import db
from datetime import datetime

class SchoolStat(db.Model):
    __tablename__ = 'school_stats'
    
    id = db.Column(db.Integer, primary_key=True)
    stat_key = db.Column(db.String(100), unique=True, nullable=False)  # e.g "students_count"
    stat_value = db.Column(db.String(100), nullable=False)  # e.g "1200"
    stat_label = db.Column(db.String(100))  # e.g "Students Enrolled"
    stat_category = db.Column(db.String(50), default='general')  # e.g "students", "staff", "facilities"
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        # Returns stat as JSON-friendly dictionary
        return {
            'id': self.id,
            'stat_key': self.stat_key,
            'stat_value': self.stat_value,
            'stat_label': self.stat_label,
            'stat_category': self.stat_category,
            'updated_at': self.updated_at.isoformat()
        }