from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.gallery import Gallery

# Blueprint for all gallery-related routes
gallery_bp = Blueprint('gallery', __name__)

@gallery_bp.route('/', methods=['GET'])
def get_gallery():
    """Get all gallery images - public endpoint"""
    images = Gallery.query.order_by(Gallery.created_at.desc()).all()  # Latest first
    return jsonify([img.to_dict() for img in images]), 200

@gallery_bp.route('/', methods=['POST'])
@jwt_required()  # Only admin can add images
def create_gallery():
    """Add a new image to the gallery"""
    data = request.get_json()
    image = Gallery(
        image_url=data['image_url'],  # Cloudinary URL from frontend
        title=data.get('title'),
        category=data.get('category')
    )
    db.session.add(image)
    db.session.commit()
    return jsonify(image.to_dict()), 201

@gallery_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()  # Only admin can delete images
def delete_gallery(id):
    """Delete a gallery image by ID"""
    image = Gallery.query.get_or_404(id)
    db.session.delete(image)
    db.session.commit()
    return jsonify({'message': 'Image deleted successfully'}), 200