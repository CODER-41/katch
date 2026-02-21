from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.alumni import Alumni

# Blueprint for all alumni-related routes
alumni_bp = Blueprint('alumni', __name__)

@alumni_bp.route('/', methods=['GET'])
def get_alumni():
    """Get all alumni - public endpoint"""
    alumni = Alumni.query.order_by(Alumni.created_at.desc()).all()
    return jsonify([a.to_dict() for a in alumni]), 200

@alumni_bp.route('/', methods=['POST'])
@jwt_required()  # Only admin can add alumni
def create_alumni():
    """Add a new alumni record"""
    data = request.get_json()
    alumni = Alumni(
        name=data['name'],
        achievement=data.get('achievement'),
        description=data.get('description')
    )
    db.session.add(alumni)
    db.session.commit()
    return jsonify(alumni.to_dict()), 201

@alumni_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()  # Only admin can update alumni
def update_alumni(id):
    """Update an alumni record by ID"""
    alumni = Alumni.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(alumni, key, value)
    db.session.commit()
    return jsonify(alumni.to_dict()), 200

@alumni_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()  # Only admin can delete alumni
def delete_alumni(id):
    """Delete an alumni record by ID"""
    alumni = Alumni.query.get_or_404(id)
    db.session.delete(alumni)
    db.session.commit()
    return jsonify({'message': 'Alumni deleted successfully'}), 200