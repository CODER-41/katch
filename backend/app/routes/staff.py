from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.staff import Staff

# Blueprint for all staff-related routes
staff_bp = Blueprint('staff', __name__)

@staff_bp.route('/', methods=['GET'])
def get_staff():
    """Get all staff members - public endpoint"""
    staff = Staff.query.all()
    return jsonify([s.to_dict() for s in staff]), 200

@staff_bp.route('/', methods=['POST'])
@jwt_required()  # Only admin can add staff
def create_staff():
    """Add a new staff member"""
    data = request.get_json()
    staff = Staff(
        name=data['name'],
        photo_url=data.get('photo_url'),
        subject=data.get('subject'),
        email=data.get('email'),
        phone=data.get('phone'),
        role=data.get('role'),
        is_leadership=data.get('is_leadership', False)
    )
    db.session.add(staff)
    db.session.commit()
    return jsonify(staff.to_dict()), 201

@staff_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()  # Only admin can update staff
def update_staff(id):
    """Update an existing staff member by ID"""
    staff = Staff.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(staff, key, value)  # Dynamically update fields
    db.session.commit()
    return jsonify(staff.to_dict()), 200

@staff_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()  # Only admin can delete staff
def delete_staff(id):
    """Delete a staff member by ID"""
    staff = Staff.query.get_or_404(id)
    db.session.delete(staff)
    db.session.commit()
    return jsonify({'message': 'Staff deleted successfully'}), 200