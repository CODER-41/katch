from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from flask_mail import Message
from app import db, mail
from app.models.admission import Admission
from threading import Thread
import os

admissions_bp = Blueprint('admissions', __name__)

CUTOFF_SCORE = 50  # KJSEA auto-flag threshold out of 72


def _send_admission_emails(app, applicant_email, applicant_name, application_number, status, admin_email):
    """Send confirmation to applicant and notification to admin — non-blocking."""
    with app.app_context():
        try:
            grade_note = (
                "Your score qualifies you for consideration. An admin will review and confirm your status shortly."
                if status == 'flagged'
                else "Your application has been received. Our admissions team will review it and contact you."
            )
            applicant_msg = Message(
                subject=f"Admission Application Received — {application_number}",
                recipients=[applicant_email],
                body=(
                    f"Dear {applicant_name},\n\n"
                    f"Thank you for applying to Kakamega School.\n\n"
                    f"Application Number: {application_number}\n"
                    f"Status: {'Under Review (Flagged for consideration)' if status == 'flagged' else 'Pending Review'}\n\n"
                    f"{grade_note}\n\n"
                    f"Please keep your application number for reference. "
                    f"You will receive an email once a decision has been made.\n\n"
                    f"Warm regards,\nKakamega School Admissions Office\n"
                    f"Once a Katcherian, always a Katcherian"
                )
            )
            mail.send(applicant_msg)
        except Exception as e:
            print(f"Applicant email failed: {e}")

        try:
            admin_msg = Message(
                subject=f"New Admission Application — {application_number}",
                recipients=[admin_email],
                body=(
                    f"A new admission application has been submitted.\n\n"
                    f"Application Number: {application_number}\n"
                    f"Applicant: {applicant_name}\n"
                    f"Email: {applicant_email}\n"
                    f"Status: {status.upper()}\n\n"
                    f"Log in to the admin dashboard to review the full application."
                )
            )
            mail.send(admin_msg)
        except Exception as e:
            print(f"Admin notification email failed: {e}")


def _send_status_email(app, applicant_email, applicant_name, application_number, status, admin_notes):
    """Notify applicant of acceptance or rejection."""
    with app.app_context():
        try:
            if status == 'accepted':
                subject = f"Congratulations! Admission Accepted — {application_number}"
                body = (
                    f"Dear {applicant_name},\n\n"
                    f"We are pleased to inform you that your application to Kakamega School "
                    f"has been ACCEPTED.\n\n"
                    f"Application Number: {application_number}\n"
                    f"Status: ACCEPTED\n\n"
                    f"{'Admin Notes: ' + admin_notes + chr(10) + chr(10) if admin_notes else ''}"
                    f"Please report to the school admissions office with all original documents "
                    f"within 7 working days to complete your enrolment.\n\n"
                    f"Congratulations and welcome to the Katcherian family!\n\n"
                    f"Warm regards,\nKakamega School Admissions Office"
                )
            else:
                subject = f"Admission Application Update — {application_number}"
                body = (
                    f"Dear {applicant_name},\n\n"
                    f"Thank you for your interest in Kakamega School. After careful review, "
                    f"we regret to inform you that your application has not been successful at this time.\n\n"
                    f"Application Number: {application_number}\n"
                    f"Status: NOT ACCEPTED\n\n"
                    f"{'Reason: ' + admin_notes + chr(10) + chr(10) if admin_notes else ''}"
                    f"We encourage you to explore other opportunities and wish you the very best.\n\n"
                    f"Warm regards,\nKakamega School Admissions Office"
                )
            mail.send(Message(subject=subject, recipients=[applicant_email], body=body))
        except Exception as e:
            print(f"Status email failed: {e}")


@admissions_bp.route('/', methods=['POST', 'OPTIONS'])
def submit_admission():
    if request.method == 'OPTIONS':
        return '', 204

    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        required = ['applicant_name', 'gender', 'date_of_birth', 'previous_school',
                    'parent_name', 'parent_phone', 'parent_email', 'kjsea_score']
        missing = [f for f in required if not data.get(f) and data.get(f) != 0]
        if missing:
            return jsonify({'error': f"Missing required fields: {', '.join(missing)}"}), 400

        score = float(data['kjsea_score'])
        if score < 0 or score > 72:
            return jsonify({'error': 'KJSEA score must be between 0 and 72'}), 400

        is_flagged = score >= CUTOFF_SCORE
        status = 'flagged' if is_flagged else 'pending'

        admission = Admission(
            applicant_name=data['applicant_name'],
            gender=data['gender'],
            date_of_birth=data['date_of_birth'],
            nationality=data.get('nationality', 'Kenyan'),
            previous_school=data['previous_school'],
            parent_name=data['parent_name'],
            parent_relationship=data.get('parent_relationship', ''),
            parent_phone=data['parent_phone'],
            parent_email=data['parent_email'],
            kjsea_score=score,
            kjsea_result_url=data.get('kjsea_result_url', ''),
            birth_cert_url=data.get('birth_cert_url', ''),
            passport_photo_url=data.get('passport_photo_url', ''),
            school_leaving_cert_url=data.get('school_leaving_cert_url', ''),
            medical_report_url=data.get('medical_report_url', ''),
            status=status,
            is_flagged=is_flagged,
        )

        try:
            db.session.add(admission)
            db.session.commit()
            admission.generate_application_number()
            db.session.commit()
        except Exception as db_err:
            import traceback
            print(f"DB error: {db_err}\n{traceback.format_exc()}")
            db.session.rollback()
            return jsonify({'error': 'Database error saving application'}), 500

        mail_username = os.getenv('MAIL_USERNAME')
        mail_password = os.getenv('MAIL_PASSWORD')
        if mail_username and mail_password:
            Thread(
                target=_send_admission_emails,
                args=(
                    current_app._get_current_object(),
                    data['parent_email'],
                    data['applicant_name'],
                    admission.application_number,
                    status,
                    mail_username,
                ),
                daemon=True,
            ).start()

        return jsonify({
            'message': 'Application submitted successfully',
            'application_number': admission.application_number,
            'status': status,
            'is_flagged': is_flagged,
        }), 201

    except Exception as e:
        import traceback
        print(f"Admission submission error: {e}\n{traceback.format_exc()}")
        return jsonify({'error': 'Failed to submit application'}), 500


@admissions_bp.route('/', methods=['GET'])
@jwt_required()
def get_admissions():
    status_filter = request.args.get('status')
    query = Admission.query.order_by(Admission.kjsea_score.desc())
    if status_filter:
        query = query.filter_by(status=status_filter)
    admissions = query.all()
    return jsonify([a.to_dict() for a in admissions]), 200


@admissions_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_admission_stats():
    total = Admission.query.count()
    flagged = Admission.query.filter_by(status='flagged').count()
    accepted = Admission.query.filter_by(status='accepted').count()
    rejected = Admission.query.filter_by(status='rejected').count()
    pending = Admission.query.filter_by(status='pending').count()
    return jsonify({
        'total': total,
        'flagged': flagged,
        'accepted': accepted,
        'rejected': rejected,
        'pending': pending,
    }), 200


@admissions_bp.route('/<int:id>/status', methods=['PUT'])
@jwt_required()
def update_status(id):
    admission = Admission.query.get_or_404(id)
    data = request.get_json()
    new_status = data.get('status')
    if new_status not in ('accepted', 'rejected', 'pending', 'flagged'):
        return jsonify({'error': 'Invalid status'}), 400

    admission.status = new_status
    admission.admin_notes = data.get('admin_notes', admission.admin_notes)
    db.session.commit()

    mail_username = os.getenv('MAIL_USERNAME')
    mail_password = os.getenv('MAIL_PASSWORD')
    if mail_username and mail_password and new_status in ('accepted', 'rejected'):
        Thread(
            target=_send_status_email,
            args=(
                current_app._get_current_object(),
                admission.parent_email,
                admission.applicant_name,
                admission.application_number,
                new_status,
                admission.admin_notes,
            ),
            daemon=True,
        ).start()

    return jsonify(admission.to_dict()), 200


@admissions_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_admission(id):
    admission = Admission.query.get_or_404(id)
    db.session.delete(admission)
    db.session.commit()
    return jsonify({'message': 'Application deleted'}), 200
