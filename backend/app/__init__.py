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

    # Register auth blueprint
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    return app