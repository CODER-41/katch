from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.kcse_results import KcseResult

# Blueprint for all KCSE results-related routes
kcse_bp = Blueprint('kcse', __name__)

@kcse_bp.route('/', methods=['GET'])
def get_kcse_results():
    """Get all KCSE results - public endpoint"""
    results = KcseResult.query.order_by(KcseResult.year.desc()).all()  # Latest year first
    return jsonify([r.to_dict() for r in results]), 200

@kcse_bp.route('/', methods=['POST'])
@jwt_required()  # Only admin can add results
def create_kcse_result():
    """Add a new KCSE result"""
    data = request.get_json()
    result = KcseResult(
        year=data['year'],
        mean_grade=data.get('mean_grade'),
        university_entry_percentage=data.get('university_entry_percentage')
    )
    db.session.add(result)
    db.session.commit()
    return jsonify(result.to_dict()), 201

@kcse_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()  # Only admin can update results
def update_kcse_result(id):
    """Update a KCSE result by ID"""
    result = KcseResult.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(result, key, value)
    db.session.commit()
    return jsonify(result.to_dict()), 200

@kcse_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()  # Only admin can delete results
def delete_kcse_result(id):
    """Delete a KCSE result by ID"""
    result = KcseResult.query.get_or_404(id)
    db.session.delete(result)
    db.session.commit()
    return jsonify({'message': 'KCSE result deleted successfully'}), 200