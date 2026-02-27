from flask import Flask, request, jsonify
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
    
    # Disable strict slashes before anything else
    app.url_map.strict_slashes = False

    # Bind extensions to the app
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    
    # Only initialize mail if credentials are present
    if app.config.get('MAIL_USERNAME') and app.config.get('MAIL_PASSWORD'):
        mail.init_app(app)

    # Configure CORS
    CORS(app, 
         origins=["http://localhost:5173", "http://localhost:8080", "https://katch-jade.vercel.app"],
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    ALLOWED_ORIGINS = ["http://localhost:5173", "http://localhost:8080", "https://katch-jade.vercel.app"]

    def add_cors_headers(response):
        origin = request.headers.get('Origin')
        if origin in ALLOWED_ORIGINS:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
            response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        return response

    @app.after_request
    def after_request(response):
        return add_cors_headers(response)

    @app.errorhandler(500)
    def internal_error(e):
        response = jsonify({'error': 'Internal server error'})
        response.status_code = 500
        return add_cors_headers(response)

    @app.errorhandler(404)
    def not_found(e):
        response = jsonify({'error': 'Not found'})
        response.status_code = 404
        return add_cors_headers(response)

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
    from app.routes.stats import stats_bp  # Stats blueprint
    from app.routes.health import health_bp
    from app.routes.admissions import admissions_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(staff_bp, url_prefix="/api/staff")
    app.register_blueprint(news_bp, url_prefix="/api/news")
    app.register_blueprint(events_bp, url_prefix="/api/events")
    app.register_blueprint(gallery_bp, url_prefix="/api/gallery")
    app.register_blueprint(alumni_bp, url_prefix="/api/alumni")
    app.register_blueprint(kcse_bp, url_prefix="/api/kcse")
    app.register_blueprint(testimonials_bp, url_prefix="/api/testimonials")
    app.register_blueprint(contact_bp, url_prefix="/api/contact")
    app.register_blueprint(stats_bp, url_prefix="/api/stats")
    app.register_blueprint(admissions_bp, url_prefix="/api/admissions")
    app.register_blueprint(health_bp, url_prefix="/api")

    return app