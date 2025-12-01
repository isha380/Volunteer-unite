from flask import Blueprint, jsonify, request, current_app
from app import db
from app.models import User
from app.models.event_model import Event
from app.models.application_model import Application
from app.models.profile_model import Profile
import jwt

dashboard_bp = Blueprint('dashboard_bp', __name__)

def verify_jwt(request):
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None, "Missing or invalid Authorization header"
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        return payload, None
    except jwt.ExpiredSignatureError:
        return None, "Token expired"
    except jwt.InvalidTokenError:
        return None, "Invalid token"

@dashboard_bp.route('/api/dashboard/<int:user_id>', methods=['GET'])
def get_dashboard_data(user_id):
    payload, error = verify_jwt(request)
    if error:
        return jsonify({"error": error}), 401

    # Optional: check if the token user_id matches requested user_id
    if payload.get('user_id') != user_id:
        return jsonify({"error": "Unauthorized access"}), 403

    # Get user info
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Admin view
    if user.role == 'admin':
        events = Event.query.all()
        applications = Application.query.all()
        return jsonify({
            "role": "admin",
            "name": user.name,
            "events": [e.to_dict() for e in events],
            "applications": [a.to_dict() for a in applications]
        })

    # Volunteer view
    profile = Profile.query.filter_by(user_id=user_id).first()
    applications = Application.query.filter_by(user_id=user_id).all()
    return jsonify({
        "role": "volunteer",
        "name": user.name,
        "profile": profile.to_dict() if profile else {},
        "applications": [a.to_dict() for a in applications]
    })
@dashboard_bp.route('/')
def home():
    return jsonify({"message": "Volunteer Unite backend is running successfully!"})

