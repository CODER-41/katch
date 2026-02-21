from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.testimonials import Testimonial

# Blueprint for all testimonial-related routes
testimonials_bp = Blueprint('testimonials', __name__)

@testimonials_bp.route('/', methods=['GET'])
def get_testimonials():
    """Get all testimonials - public endpoint"""
    testimonials = Testimonial.query.order_by(Testimonial.created_at.desc()).all()
    return jsonify([t.to_dict() for t in testimonials]), 200

@testimonials_bp.route('/', methods=['POST'])
@jwt_required()  # Only admin can add testimonials
def create_testimonial():
    """Add a new testimonial"""
    data = request.get_json()
    testimonial = Testimonial(
        student_name=data['student_name'],
        year=data.get('year'),
        quote=data['quote']
    )
    db.session.add(testimonial)
    db.session.commit()
    return jsonify(testimonial.to_dict()), 201

@testimonials_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()  # Only admin can update testimonials
def update_testimonial(id):
    """Update a testimonial by ID"""
    testimonial = Testimonial.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(testimonial, key, value)
    db.session.commit()
    return jsonify(testimonial.to_dict()), 200

@testimonials_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()  # Only admin can delete testimonials
def delete_testimonial(id):
    """Delete a testimonial by ID"""
    testimonial = Testimonial.query.get_or_404(id)
    db.session.delete(testimonial)
    db.session.commit()
    return jsonify({'message': 'Testimonial deleted successfully'}), 200