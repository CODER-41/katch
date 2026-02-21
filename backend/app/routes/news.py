from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.news import News

# Blueprint for all news-related routes
news_bp = Blueprint('news', __name__)

@news_bp.route('/', methods=['GET'])
def get_news():
    """Get all news articles - public endpoint"""
    news = News.query.order_by(News.created_at.desc()).all()  # Latest first
    return jsonify([n.to_dict() for n in news]), 200

@news_bp.route('/<int:id>', methods=['GET'])
def get_single_news(id):
    """Get a single news article by ID"""
    news = News.query.get_or_404(id)
    return jsonify(news.to_dict()), 200

@news_bp.route('/', methods=['POST'])
@jwt_required()  # Only admin can create news
def create_news():
    """Create a new news article"""
    data = request.get_json()
    news = News(
        title=data['title'],
        excerpt=data.get('excerpt'),
        content=data.get('content'),
        category=data.get('category')
    )
    db.session.add(news)
    db.session.commit()
    return jsonify(news.to_dict()), 201

@news_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()  # Only admin can update news
def update_news(id):
    """Update a news article by ID"""
    news = News.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(news, key, value)
    db.session.commit()
    return jsonify(news.to_dict()), 200

@news_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()  # Only admin can delete news
def delete_news(id):
    """Delete a news article by ID"""
    news = News.query.get_or_404(id)
    db.session.delete(news)
    db.session.commit()
    return jsonify({'message': 'News deleted successfully'}), 200