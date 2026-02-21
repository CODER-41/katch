from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db, bcrypt
from app.models.admin import AdminUser

# Create a Blueprint for auth routes
# All routes here will be prefixed with /api/auth
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Admin login endpoint - accepts email and password, returns JWT token"""
    data = request.get_json()  # Get JSON data from request body

    # Validate that email and password are provided
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400

    # Find admin user by email in database
    admin = AdminUser.query.filter_by(email=data['email']).first()

    # Check if admin exists and password is correct
    if not admin or not bcrypt.check_password_hash(admin.password_hash, data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    # Create JWT access token with admin's id as identity
    access_token = create_access_token(identity=str(admin.id))

    return jsonify({
        'access_token': access_token,
        'admin': admin.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()  # This route requires a valid JWT token
def get_current_admin():
    """Returns the currently logged in admin's details"""
    admin_id = get_jwt_identity()  # Get admin id from JWT token
    admin = AdminUser.query.get(admin_id)

    if not admin:
        return jsonify({'error': 'Admin not found'}), 404

    return jsonify(admin.to_dict()), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout endpoint - client should delete the token on their side"""
    return jsonify({'message': 'Logged out successfully'}), 200