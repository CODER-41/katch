from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.school_stats import SchoolStat

# Blueprint for all school stats routes
stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/', methods=['GET'])
def get_stats():
    """Get all school stats - public endpoint"""
    stats = SchoolStat.query.all()
    return jsonify([s.to_dict() for s in stats]), 200

@stats_bp.route('/', methods=['POST'])
@jwt_required()  # Only admin can add stats
def create_stat():
    """Create a new school stat"""
    data = request.get_json()
    stat = SchoolStat(
        stat_key=data['stat_key'],
        stat_value=data['stat_value'],
        stat_label=data.get('stat_label'),
        stat_category=data.get('stat_category', 'general')
    )
    db.session.add(stat)
    db.session.commit()
    return jsonify(stat.to_dict()), 201

@stats_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()  # Only admin can update stats
def update_stat(id):
    """Update a school stat by ID"""
    stat = SchoolStat.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(stat, key, value)
    db.session.commit()
    return jsonify(stat.to_dict()), 200

@stats_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()  # Only admin can delete stats
def delete_stat(id):
    """Delete a school stat by ID"""
    stat = SchoolStat.query.get_or_404(id)
    db.session.delete(stat)
    db.session.commit()
    return jsonify({'message': 'Stat deleted successfully'}), 200