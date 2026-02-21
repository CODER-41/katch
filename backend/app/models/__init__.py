# Import all models here so Flask-SQLAlchemy can discover them
# This file acts as the entry point for all database models

from app.models.admin import AdminUser
from app.models.staff import Staff
from app.models.news import News
from app.models.events import Event
from app.models.gallery import Gallery
from app.models.alumni import Alumni
from app.models.kcse_results import KcseResult
from app.models.testimonials import Testimonial
from app.models.contact import ContactSubmission
from app.models.school_stats import SchoolStat