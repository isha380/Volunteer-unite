from flask import Blueprint, request, jsonify
from app import db
from app.models.event_model import Event
from functools import wraps
from datetime import datetime

event_bp = Blueprint('events', __name__)

# Admin authentication decorator
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get token from header
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        # TODO: Verify token and check if user is admin
        # For now, this is a placeholder
        # You should implement proper JWT token verification here
        # and check if the user has admin role
        
        # Example:
        # try:
        #     payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        #     if payload.get('role') != 'admin':
        #         return jsonify({'error': 'Admin access required'}), 403
        #     request.user_id = payload.get('user_id')
        # except jwt.ExpiredSignatureError:
        #     return jsonify({'error': 'Token expired'}), 401
        # except jwt.InvalidTokenError:
        #     return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    return decorated_function

# Create Event (Admin only)
@event_bp.route('/events', methods=['POST'])
# @admin_required
def create_event():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'event_date', 'event_time', 
                          'location', 'max_volunteers']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Parse date
        try:
            event_date = datetime.strptime(data['event_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Create new event
        new_event = Event(
            title=data['title'],
            description=data['description'],
            event_date=event_date,
            event_time=data['event_time'],
            location=data['location'],
            category=data.get('category', ''),
            max_volunteers=int(data['max_volunteers']),
            required_skills=data.get('required_skills', ''),
            created_by=request.user_id if hasattr(request, 'user_id') else 1,  # Get from token
            status=data.get('status', 'active')
        )
        
        db.session.add(new_event)
        db.session.commit()
        
        return jsonify({
            'message': 'Event created successfully',
            'event': new_event.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all events
@event_bp.route('/events', methods=['GET'])
def get_events():
    try:
        status = request.args.get('status', 'active')
        events = Event.query.filter_by(status=status).all()
        return jsonify({
            'events': [event.to_dict() for event in events]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get single event
@event_bp.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    try:
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        return jsonify({'event': event.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Update event (Admin only)
@event_bp.route('/events/<int:event_id>', methods=['PUT'])
# @admin_required
def update_event(event_id):
    try:
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        data = request.get_json()
        
        # Update fields if provided
        if 'title' in data:
            event.title = data['title']
        if 'description' in data:
            event.description = data['description']
        if 'event_date' in data:
            event.event_date = datetime.strptime(data['event_date'], '%Y-%m-%d').date()
        if 'event_time' in data:
            event.event_time = data['event_time']
        if 'location' in data:
            event.location = data['location']
        if 'category' in data:
            event.category = data['category']
        if 'max_volunteers' in data:
            event.max_volunteers = int(data['max_volunteers'])
        if 'required_skills' in data:
            event.required_skills = data['required_skills']
        if 'status' in data:
            event.status = data['status']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Event updated successfully',
            'event': event.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete event (Admin only)
@event_bp.route('/events/<int:event_id>', methods=['DELETE'])
# @admin_required
def delete_event(event_id):
    try:
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        db.session.delete(event)
        db.session.commit()
        
        return jsonify({'message': 'Event deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500