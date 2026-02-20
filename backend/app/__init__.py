from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail
from flask_bcrypt import Bcrypt
from config import Config

db = SQLAlchemy()
jwt = JWTManager()
mail = Mail()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    bcrypt.init_app(app)
    CORS(app, origins=["http://localhost:5173"])

    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    return app