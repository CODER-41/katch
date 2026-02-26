import os
from dotenv import load_dotenv
from datetime import timedelta

# Load environment variables from .env file
load_dotenv()

class Config:
    # General Flask secret key
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    
    # PostgreSQL database connection
    # Render provides "postgres://" but SQLAlchemy 2.x requires "postgresql://"
    _db_url = os.getenv("DATABASE_URL", "")
    SQLALCHEMY_DATABASE_URI = _db_url.replace("postgres://", "postgresql://", 1) if _db_url else None
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
        "connect_args": {"connect_timeout": 10},  # fail fast if DB is unreachable
    }
    
    # JWT secret key and token expiry set to 24 hours
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-key")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # Email settings for contact form notifications
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_USERNAME")  # Use same Gmail as sender
    
    # Frontend URL for CORS
    FRONTEND_URL = os.getenv("FRONTEND_URL")