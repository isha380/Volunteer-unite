from flask import Blueprint, request, jsonify
from app import db
from app.models.event_model import Event
from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt

admin_bp = Blueprint('admin', __name__)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            verify_jwt_in_request()
            claims = get_jwt()
            
            if claims.get('role') != 'admin':
                return jsonify({'error': 'Admin access required'}), 403
                
        except Exception as e:
            return jsonify({'error': 'Invalid or missing token'}), 401
        
        return f(*args, **kwargs)
    return decorated_function

# Get dashboard statistics
@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_dashboard_stats():
    try:
        # Total events
        total_events = Event.query.filter_by(status='active').count()
        
        # TODO: Add these queries based on your database schema
        # total_applicants = Application.query.count()
        # approved = Application.query.filter_by(status='approved').count()
        # attended = Attendance.query.count()
        
        return jsonify({
            'total_events': total_events,
            'total_applicants': 47,  # Placeholder
            'approved': 37,  # Placeholder
            'attended': 8  # Placeholder
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500