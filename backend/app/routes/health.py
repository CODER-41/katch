from flask import Blueprint, jsonify
from app import db
from sqlalchemy import text

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"}), 200

@health_bp.route('/ping', methods=['GET'])
def ping():
    """Wakes up the database. Call this on page load to pre-warm the DB connection."""
    try:
        db.session.execute(text('SELECT 1'))
        return jsonify({"status": "ok", "db": "connected"}), 200
    except Exception:
        return jsonify({"status": "ok", "db": "warming"}), 200
