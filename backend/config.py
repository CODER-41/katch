import os
from dotenv import load_dotenv
from datetime import timedelta

# Load environment variables from .env file
load_dotenv()

class Config:
    # General Flask secret key
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    
    # PostgreSQL database connection
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Disable modification tracking to save memory
    
    # JWT secret key and token expiry set to 24 hours
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-key")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)  # Token lasts 24 hours instead of 15 minutes
    
    # Email settings for contact form notifications
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    
    # Frontend URL for CORS
    FRONTEND_URL = os.getenv("FRONTEND_URL")