from app import db
from datetime import datetime


class Admission(db.Model):
    __tablename__ = 'admissions'

    id = db.Column(db.Integer, primary_key=True)
    application_number = db.Column(db.String(20), unique=True)

    # Personal Information
    applicant_name = db.Column(db.String(150), nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    date_of_birth = db.Column(db.String(20), nullable=False)
    nationality = db.Column(db.String(100), default='Kenyan')
    previous_school = db.Column(db.String(200), nullable=False)

    # Parent / Guardian
    parent_name = db.Column(db.String(150), nullable=False)
    parent_relationship = db.Column(db.String(50))
    parent_phone = db.Column(db.String(20), nullable=False)
    parent_email = db.Column(db.String(255), nullable=False)

    # KJSEA Academic Results (out of 72)
    kjsea_score = db.Column(db.Float, nullable=False)

    # Supporting Documents (Cloudinary URLs)
    kjsea_result_url = db.Column(db.String(500))
    birth_cert_url = db.Column(db.String(500))
    passport_photo_url = db.Column(db.String(500))
    school_leaving_cert_url = db.Column(db.String(500))
    medical_report_url = db.Column(db.String(500))

    # Status & Admin
    status = db.Column(db.String(20), default='pending')  # pending | flagged | accepted | rejected
    is_flagged = db.Column(db.Boolean, default=False)      # auto-set when kjsea_score >= 50
    admin_notes = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def generate_application_number(self):
        year = datetime.utcnow().year
        self.application_number = f"KS-{year}-{self.id:04d}"

    @staticmethod
    def get_grade_band(score):
        if score >= 60:
            return 'EE'
        elif score >= 50:
            return 'ME'
        elif score >= 40:
            return 'AE'
        else:
            return 'BE'

    def to_dict(self):
        return {
            'id': self.id,
            'application_number': self.application_number,
            'applicant_name': self.applicant_name,
            'gender': self.gender,
            'date_of_birth': self.date_of_birth,
            'nationality': self.nationality,
            'previous_school': self.previous_school,
            'parent_name': self.parent_name,
            'parent_relationship': self.parent_relationship,
            'parent_phone': self.parent_phone,
            'parent_email': self.parent_email,
            'kjsea_score': self.kjsea_score,
            'grade_band': self.get_grade_band(self.kjsea_score),
            'kjsea_result_url': self.kjsea_result_url,
            'birth_cert_url': self.birth_cert_url,
            'passport_photo_url': self.passport_photo_url,
            'school_leaving_cert_url': self.school_leaving_cert_url,
            'medical_report_url': self.medical_report_url,
            'status': self.status,
            'is_flagged': self.is_flagged,
            'admin_notes': self.admin_notes,
            'created_at': self.created_at.isoformat(),
        }
