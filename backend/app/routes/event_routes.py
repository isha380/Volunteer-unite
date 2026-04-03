# from flask import Blueprint, request, jsonify
# from app import db
# from app.models.event_model import Event
# from functools import wraps
# from datetime import datetime

# event_bp = Blueprint('events', __name__)


# def admin_required(f):
#     @wraps(f)
#     def decorated_function(*args, **kwargs):
        
#         token = request.headers.get('Authorization')
        
#         if not token:
#             return jsonify({'error': 'No token provided'}), 401
        
        
#         return f(*args, **kwargs)
#     return decorated_function


# @event_bp.route('/events', methods=['POST'])
# # @admin_required
# def create_event():
#     try:
#         data = request.get_json()
        
       
#         required_fields = ['title', 'description', 'event_date', 'event_time', 
#                           'location', 'max_volunteers']
        
#         for field in required_fields:
#             if field not in data:
#                 return jsonify({'error': f'Missing required field: {field}'}), 400
        
      
#         try:
#             event_date = datetime.strptime(data['event_date'], '%Y-%m-%d').date()
#         except ValueError:
#             return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
       
#         new_event = Event(
#             title=data['title'],
#             description=data['description'],
#             event_date=event_date,
#             event_time=data['event_time'],
#             location=data['location'],
#             category=data.get('category', ''),
#             max_volunteers=int(data['max_volunteers']),
#             required_skills=data.get('required_skills', ''),
#             created_by=request.user_id if hasattr(request, 'user_id') else 1,  # Get from token
#             status=data.get('status', 'active')
#         )
        
#         db.session.add(new_event)
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Event created successfully',
#             'event': new_event.to_dict()
#         }), 201
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500


# @event_bp.route('/events', methods=['GET'])
# def get_events():
#     try:
#         status = request.args.get('status', 'active')
#         events = Event.query.filter_by(status=status).all()
#         return jsonify({
#             'events': [event.to_dict() for event in events]
#         }), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # Get single event
# @event_bp.route('/events/<int:event_id>', methods=['GET'])
# def get_event(event_id):
#     try:
#         event = Event.query.get(event_id)
#         if not event:
#             return jsonify({'error': 'Event not found'}), 404
#         return jsonify({'event': event.to_dict()}), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # Update event (Admin only)
# @event_bp.route('/events/<int:event_id>', methods=['PUT'])
# # @admin_required
# def update_event(event_id):
#     try:
#         event = Event.query.get(event_id)
#         if not event:
#             return jsonify({'error': 'Event not found'}), 404
        
#         data = request.get_json()
        
       
#         if 'title' in data:
#             event.title = data['title']
#         if 'description' in data:
#             event.description = data['description']
#         if 'event_date' in data:
#             event.event_date = datetime.strptime(data['event_date'], '%Y-%m-%d').date()
#         if 'event_time' in data:
#             event.event_time = data['event_time']
#         if 'location' in data:
#             event.location = data['location']
#         if 'category' in data:
#             event.category = data['category']
#         if 'max_volunteers' in data:
#             event.max_volunteers = int(data['max_volunteers'])
#         if 'required_skills' in data:
#             event.required_skills = data['required_skills']
#         if 'status' in data:
#             event.status = data['status']
        
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Event updated successfully',
#             'event': event.to_dict()
#         }), 200
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500


# @event_bp.route('/events/<int:event_id>', methods=['DELETE'])
# # @admin_required
# def delete_event(event_id):
#     try:
#         event = Event.query.get(event_id)
#         if not event:
#             return jsonify({'error': 'Event not found'}), 404
        
#         db.session.delete(event)
#         db.session.commit()
        
#         return jsonify({'message': 'Event deleted successfully'}), 200
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500

# from flask import Blueprint, request, jsonify
# from app import db
# from app.models.event_model import Event
# from app.models.application_model import Application
# from flask_jwt_extended import jwt_required, get_jwt
# from app.routes.auth_routes import admin_required
# from datetime import datetime


# events_bp = Blueprint('events', __name__, strict_slashes=False)

# # GET ALL EVENTS (Public - for volunteers to browse)
# @events_bp.route('/', methods=['GET'])
# def get_all_events():
#     try:
       
#         events = Event.query.filter_by(status='Active').all()
        
#         events_data = [event.to_dict() for event in events]
        
#         return jsonify(events_data), 200
        
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# # GET SINGLE EVENT
# @events_bp.route('/<int:event_id>', methods=['GET'])
# def get_event(event_id):
#     try:
#         event = Event.query.get(event_id)
        
#         if not event:
#             return jsonify({'message': 'Event not found'}), 404
        
#         return jsonify(event.to_dict()), 200
        
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# # CREATE EVENT (Admin only)
# @events_bp.route('/', methods=['POST'])
# @jwt_required()
# @admin_required
# def create_event():
#     try:
#         data = request.get_json()
        
#         # Convert date string to date object
#         event_date = datetime.strptime(data['event_date'], '%Y-%m-%d').date()
        
#         new_event = Event(
#             title=data['title'],
#             description=data['description'],
#             event_date=event_date,
#             event_time=data['event_time'],
#             location=data['location'],
#             category=data.get('category'),
#             max_volunteers=data['max_volunteers'],
#             required_skills=data.get('required_skills', ''),  # Comma-separated string
#             urgency=data.get('urgency', 'Normal'),
#             created_by=int(get_jwt()['sub']),  # Admin ID from JWT
#             status='Active'
#         )
        
#         db.session.add(new_event)
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Event created successfully',
#             'event': new_event.to_dict()
#         }), 201
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500


# # UPDATE EVENT (Admin only)
# @events_bp.route('/<int:event_id>', methods=['PUT'])
# @jwt_required()
# @admin_required
# def update_event(event_id):
#     try:
#         event = Event.query.get(event_id)
        
#         if not event:
#             return jsonify({'message': 'Event not found'}), 404
        
#         data = request.get_json()
        
#         # Update fields
#         event.title = data.get('title', event.title)
#         event.description = data.get('description', event.description)
#         event.location = data.get('location', event.location)
#         event.category = data.get('category', event.category)
#         event.max_volunteers = data.get('max_volunteers', event.max_volunteers)
#         event.required_skills = data.get('required_skills', event.required_skills)
#         event.urgency = data.get('urgency', event.urgency)
#         event.event_time = data.get('event_time', event.event_time)
#         event.status = data.get('status', event.status)
        
#         if 'event_date' in data:
#             event.event_date = datetime.strptime(data['event_date'], '%Y-%m-%d').date()
        
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Event updated successfully',
#             'event': event.to_dict()
#         }), 200
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500


# #  DELETE EVENT (Admin only)
# @events_bp.route('/<int:event_id>', methods=['DELETE'])
# @jwt_required()
# @admin_required
# def delete_event(event_id):
#     try:
#         event = Event.query.get(event_id)
        
#         if not event:
#             return jsonify({'message': 'Event not found'}), 404
        
#         db.session.delete(event)
#         db.session.commit()
        
#         return jsonify({'message': 'Event deleted successfully'}), 200
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500


from flask import Blueprint, request, jsonify
from app import db
from app.models.event_model import Event
from app.models.application_model import Application
from flask_jwt_extended import jwt_required, get_jwt
from app.routes.auth_routes import admin_required
from datetime import datetime

events_bp = Blueprint('events', __name__)

# GET ALL EVENTS (Public - for volunteers to browse)
@events_bp.route('/', methods=['GET'], strict_slashes=False)
def get_all_events():
    try:
        # events = Event.query.filter_by(status='active').all()
        events = Event.query.all()
        events_data = [event.to_dict() for event in events]
        return jsonify(events_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# GET SINGLE EVENT
@events_bp.route('/<int:event_id>', methods=['GET'], strict_slashes=False)
def get_event(event_id):
    try:
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'message': 'Event not found'}), 404
        return jsonify(event.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# CREATE EVENT (Admin only)
@events_bp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required()
@admin_required
def create_event():
    try:
        data = request.get_json()
        event_date = datetime.strptime(data['event_date'], '%Y-%m-%d').date()
        
        new_event = Event(
            title=data['title'],
            description=data['description'],
            event_date=event_date,
            event_time=data['event_time'],
            location=data['location'],
            category=data.get('category'),
            max_volunteers=data['max_volunteers'],
            required_skills=data.get('required_skills', ''),
            urgency=data.get('urgency', 'Normal'),
            created_by=int(get_jwt()['sub']),
            status='Active'
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


# UPDATE EVENT (Admin only)
@events_bp.route('/<int:event_id>', methods=['PUT'], strict_slashes=False)
@jwt_required()
@admin_required
def update_event(event_id):
    try:
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'message': 'Event not found'}), 404
        
        data = request.get_json()
        event.title = data.get('title', event.title)
        event.description = data.get('description', event.description)
        event.location = data.get('location', event.location)
        event.category = data.get('category', event.category)
        event.max_volunteers = data.get('max_volunteers', event.max_volunteers)
        event.required_skills = data.get('required_skills', event.required_skills)
        event.urgency = data.get('urgency', event.urgency)
        event.event_time = data.get('event_time', event.event_time)
        event.status = data.get('status', event.status)
        
        if 'event_date' in data:
            event.event_date = datetime.strptime(data['event_date'], '%Y-%m-%d').date()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Event updated successfully',
            'event': event.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# DELETE EVENT (Admin only)
@events_bp.route('/<int:event_id>', methods=['DELETE'], strict_slashes=False)
@jwt_required()
@admin_required
def delete_event(event_id):
    try:
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'message': 'Event not found'}), 404
        
        db.session.delete(event)
        db.session.commit()
        
        return jsonify({'message': 'Event deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500