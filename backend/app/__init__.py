from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail
from flask_bcrypt import Bcrypt
from config import Config

# Initialize extensions without binding to app yet
db = SQLAlchemy()
jwt = JWTManager()
mail = Mail()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)  # Load config from config.py

    # Bind extensions to the app
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    bcrypt.init_app(app)

    # Allow requests from React frontend
    CORS(app, origins=["http://localhost:5173"])

    # Import all models so SQLAlchemy knows about them
    from app import models

    # Create all database tables if they don't exist
    with app.app_context():
        db.create_all()

    # Register all blueprints with their URL prefixes
    from app.routes.auth import auth_bp
    from app.routes.staff import staff_bp
    from app.routes.news import news_bp
    from app.routes.events import events_bp
    from app.routes.gallery import gallery_bp
    from app.routes.alumni import alumni_bp
    from app.routes.kcse_results import kcse_bp
    from app.routes.testimonials import testimonials_bp
    from app.routes.contact import contact_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(staff_bp, url_prefix="/api/staff")
    app.register_blueprint(news_bp, url_prefix="/api/news")
    app.register_blueprint(events_bp, url_prefix="/api/events")
    app.register_blueprint(gallery_bp, url_prefix="/api/gallery")
    app.register_blueprint(alumni_bp, url_prefix="/api/alumni")
    app.register_blueprint(kcse_bp, url_prefix="/api/kcse")
    app.register_blueprint(testimonials_bp, url_prefix="/api/testimonials")
    app.register_blueprint(contact_bp, url_prefix="/api/contact")

    return app