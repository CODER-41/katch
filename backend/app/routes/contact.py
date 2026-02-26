from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from flask_mail import Message
from app import db, mail
from app.models.contact import ContactSubmission
import os

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/', methods=['POST', 'OPTIONS'])
def submit_contact():
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        if not data.get('name') or not data.get('email') or not data.get('message'):
            return jsonify({'error': 'Name, email and message are required'}), 400
        
        try:
            submission = ContactSubmission(
                name=data['name'],
                email=data['email'],
                phone=data.get('phone', ''),
                subject=data.get('subject', ''),
                message=data['message']
            )
            db.session.add(submission)
            db.session.commit()
        except Exception as db_error:
            import traceback
            print(f"Database error: {db_error}")
            print(traceback.format_exc())
            db.session.rollback()
            return jsonify({'error': 'Database error'}), 500
        
        mail_username = os.getenv("MAIL_USERNAME")
        mail_password = os.getenv("MAIL_PASSWORD")
        
        if mail_username and mail_password:
            try:
                school_msg = Message(
                    subject=f"New Contact Message: {data.get('subject', 'No Subject')}",
                    recipients=[mail_username],
                    body=f"Name: {data['name']}\nEmail: {data['email']}\nPhone: {data.get('phone', 'Not provided')}\nMessage:\n{data['message']}"
                )
                mail.send(school_msg)
                auto_reply = Message(
                    subject="Thank you for contacting Kakamega School",
                    recipients=[data['email']],
                    body=f"Dear {data['name']},\n\nThank you for reaching out to Kakamega School. We have received your message and will get back to you within 24 hours.\n\nWarm regards,\nKakamega School Administration\nOnce a Katcherian, always a Katcherian"
                )
                mail.send(auto_reply)
            except Exception as mail_error:
                print(f"Email sending failed: {mail_error}")
        
        return jsonify({'message': 'Message sent successfully'}), 201
    except Exception as e:
        import traceback
        print(f"Contact submission error: {e}")
        print(traceback.format_exc())
        return jsonify({'error': 'Failed to submit message'}), 500

@contact_bp.route('/', methods=['GET'])
@jwt_required()
def get_submissions():
    submissions = ContactSubmission.query.order_by(ContactSubmission.created_at.desc()).all()
    return jsonify([s.to_dict() for s in submissions]), 200

@contact_bp.route('/<int:id>/read', methods=['PUT'])
@jwt_required()
def mark_as_read(id):
    submission = ContactSubmission.query.get_or_404(id)
    submission.is_read = True
    db.session.commit()
    return jsonify(submission.to_dict()), 200

@contact_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_submission(id):
    submission = ContactSubmission.query.get_or_404(id)
    db.session.delete(submission)
    db.session.commit()
    return jsonify({'message': 'Submission deleted successfully'}), 200
