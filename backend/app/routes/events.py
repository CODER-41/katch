from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.events import Event

# Blueprint for all event-related routes
events_bp = Blueprint('events', __name__)

@events_bp.route('/', methods=['GET'])
def get_events():
    """Get all events - public endpoint"""
    events = Event.query.order_by(Event.created_at.desc()).all()  # Latest first
    return jsonify([e.to_dict() for e in events]), 200

@events_bp.route('/', methods=['POST'])
@jwt_required()  # Only admin can create events
def create_event():
    """Create a new event"""
    data = request.get_json()
    event = Event(
        title=data['title'],
        date=data.get('date'),
        description=data.get('description')
    )
    db.session.add(event)
    db.session.commit()
    return jsonify(event.to_dict()), 201

@events_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()  # Only admin can update events
def update_event(id):
    """Update an event by ID"""
    event = Event.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(event, key, value)
    db.session.commit()
    return jsonify(event.to_dict()), 200

@events_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()  # Only admin can delete events
def delete_event(id):
    """Delete an event by ID"""
    event = Event.query.get_or_404(id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted successfully'}), 200