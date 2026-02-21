from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.contact import ContactSubmission

# Blueprint for all contact-related routes
contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/', methods=['POST'])
def submit_contact():
    """Submit a contact form - public endpoint, anyone can contact the school"""
    data = request.get_json()

    # Validate required fields
    if not data.get('name') or not data.get('email') or not data.get('message'):
        return jsonify({'error': 'Name, email and message are required'}), 400

    # Save submission to database
    submission = ContactSubmission(
        name=data['name'],
        email=data['email'],
        phone=data.get('phone'),
        subject=data.get('subject'),
        message=data['message']
    )
    db.session.add(submission)
    db.session.commit()
    return jsonify({'message': 'Message sent successfully'}), 201

@contact_bp.route('/', methods=['GET'])
@jwt_required()  # Only admin can view submissions
def get_submissions():
    """Get all contact form submissions"""
    submissions = ContactSubmission.query.order_by(ContactSubmission.created_at.desc()).all()
    return jsonify([s.to_dict() for s in submissions]), 200

@contact_bp.route('/<int:id>/read', methods=['PUT'])
@jwt_required()  # Only admin can mark as read
def mark_as_read(id):
    """Mark a contact submission as read"""
    submission = ContactSubmission.query.get_or_404(id)
    submission.is_read = True
    db.session.commit()
    return jsonify(submission.to_dict()), 200

@contact_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()  # Only admin can delete submissions
def delete_submission(id):
    """Delete a contact submission by ID"""
    submission = ContactSubmission.query.get_or_404(id)
    db.session.delete(submission)
    db.session.commit()
    return jsonify({'message': 'Submission deleted successfully'}), 200