

from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.volunteer_model import Volunteer
from sqlalchemy import text
import os
from flask_cors import CORS
from app.models.application_model import Application
from app.models.event_model import Event




volunteers_bp = Blueprint('volunteers_bp', __name__, url_prefix='/volunteers')
CORS(volunteers_bp)


# ----------------------------------------------------
# REGISTER A NEW VOLUNTEER
# ----------------------------------------------------
@volunteers_bp.route('/', methods=['POST', 'OPTIONS'])
def add_volunteer():
    if request.method == 'OPTIONS':
        return '', 204

    fullname = request.form.get("fullname")
    email = request.form.get("email")
    phone = request.form.get("phone")
    password = request.form.get("password")
    skills = request.form.get("skills")
    interests = request.form.get("interests")
    availability = request.form.get("availability")
    photo = request.files.get("profile")

    if not all([fullname, email, phone, password, skills]):
        return jsonify({"message": "Missing required fields"}), 400

    filename = None
    if photo:
        filename = photo.filename
        upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        photo.save(upload_path)

    volunteer = Volunteer(
        name=fullname,
        email=email,
        phone=phone,
        password_hash=generate_password_hash(password),
        skills=skills,
        interests=interests,
        availability=availability,
        profile=filename,
        role="volunteer"
    )

    db.session.add(volunteer)
    db.session.commit()

    return jsonify({"message": "Registration successful"}), 201


# ----------------------------------------------------
# GET LOGGED-IN VOLUNTEER PROFILE
# ----------------------------------------------------
@volunteers_bp.route('/volunteer/profile', methods=['GET', 'OPTIONS'])
@jwt_required(optional=True)  # Changed to optional for OPTIONS
def get_volunteer_profile():
    if request.method == "OPTIONS":
        return '', 204

    volunteer_id = get_jwt_identity()
    
    if not volunteer_id:
        return jsonify({"message": "Authentication required"}), 401
    
    volunteer = Volunteer.query.get(volunteer_id)

    if not volunteer:
        return jsonify({"message": "Volunteer not found"}), 404

    return jsonify({
        "id": volunteer.volunteer_id,  
        "name": volunteer.name,
        "email": volunteer.email,
        "phone": volunteer.phone,
        "skills": volunteer.skills.split(",") if volunteer.skills else [],
        "interests": volunteer.interests.split(",") if volunteer.interests else [],
        "availability": volunteer.availability,
        "profile": volunteer.profile,
        "role": volunteer.role,
        "joined_at": volunteer.joined_at.isoformat() if volunteer.joined_at else None
    }), 200


# ----------------------------------------------------
# UPDATE VOLUNTEER PROFILE 
# ----------------------------------------------------
@volunteers_bp.route('/volunteer/profile', methods=['PUT', 'OPTIONS'])
@jwt_required(optional=True)
def update_volunteer_profile():
    if request.method == "OPTIONS":
        return '', 204

    volunteer_id = get_jwt_identity()
    
    if not volunteer_id:
        return jsonify({"message": "Authentication required"}), 401
    
    volunteer = Volunteer.query.get(volunteer_id)

    if not volunteer:
        return jsonify({"message": "Volunteer not found"}), 404

    # Accept JSON for text fields
    data = request.get_json()

    volunteer.name = data.get("name", volunteer.name)
    volunteer.phone = data.get("phone", volunteer.phone)
    volunteer.skills = data.get("skills", volunteer.skills)
    volunteer.interests = data.get("interests", volunteer.interests)
    volunteer.availability = data.get("availability", volunteer.availability)

    db.session.commit()

    return jsonify({"message": "Profile updated successfully"}), 200


# ----------------------------------------------------
# UPLOAD PROFILE PICTURE
# ----------------------------------------------------
@volunteers_bp.route('/volunteer/profile/picture', methods=['POST', 'OPTIONS'])
@jwt_required(optional=True)
def update_profile_picture():
    if request.method == "OPTIONS":
        return '', 204

    volunteer_id = get_jwt_identity()
    
    if not volunteer_id:
        return jsonify({"message": "Authentication required"}), 401
    
    volunteer = Volunteer.query.get(volunteer_id)

    if not volunteer:
        return jsonify({"message": "Volunteer not found"}), 404

    photo = request.files.get("profile")
    
    if not photo:
        return jsonify({"message": "No image provided"}), 400

   
    from werkzeug.utils import secure_filename
    filename = f"{volunteer_id}_{secure_filename(photo.filename)}"
 
    upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    photo.save(upload_path)
    
    # Update database
    volunteer.profile = filename
    db.session.commit()

    return jsonify({
        "message": "Profile picture updated successfully",
        "profile": filename
    }), 200

# ----------------------------------------------------
# DASHBOARD STATS FOR VOLUNTEER
# ----------------------------------------------------
@volunteers_bp.route('/dashboard-stats', methods=['GET', 'OPTIONS'])
@jwt_required(optional=True)
def dashboard_stats():
    if request.method == "OPTIONS":
        return '', 204

    
    volunteer_id = get_jwt_identity()
    if not volunteer_id:
        return jsonify({"message": "Authentication required"}), 401

    active_events = db.session.execute(
        text("SELECT COUNT(*) FROM events WHERE status='ACTIVE'")
    ).scalar()

    total_volunteers = db.session.execute(
        text("SELECT COUNT(*) FROM volunteers")
    ).scalar()

    urgent_events = db.session.execute(
        text("SELECT COUNT(*) FROM events WHERE category='Emergency'")
    ).scalar()

    return jsonify({
        "activeEvents": active_events,
        "totalVolunteers": total_volunteers,
        "urgentEvents": urgent_events
    })




# ----------------------------------------------------
# APPLY FOR EVENT
# ----------------------------------------------------
@volunteers_bp.route("/apply/<int:event_id>", methods=["POST"])
@jwt_required()
def apply_for_event(event_id):
    try:
        volunteer_id = get_jwt_identity()

       
        event = Event.query.get(event_id)
        if not event:
            return jsonify({"message": "Event not found"}), 404

       
        if event.status != 'Active':
            return jsonify({"message": "Event is not active"}), 400

        if event.max_volunteers:
            current_applications = Application.query.filter_by(event_id=event_id).count()
            if current_applications >= event.max_volunteers:
                return jsonify({"message": "Event is full"}), 400

        # Prevent duplicate application
        existing = Application.query.filter_by(
            volunteer_id=volunteer_id, 
            event_id=event_id
        ).first()
        
        if existing:
            return jsonify({"message": "You have already applied for this event"}), 400

        # Create new application
        application = Application(
            volunteer_id=volunteer_id,
            event_id=event_id,
            status='Pending',
            confirmation_status='Pending'
        )
        
        db.session.add(application)
        db.session.commit()

        return jsonify({
            "message": "Application submitted successfully",
            "application_id": application.application_id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ----------------------------------------------------
# GET VOLUNTEER'S APPLICATIONS
# ----------------------------------------------------
@volunteers_bp.route("/my-applications", methods=["GET"])
@jwt_required()
def get_my_applications():
    try:
        volunteer_id = get_jwt_identity()
        
        applications = db.session.query(
            Application, Event
        ).join(
            Event, Application.event_id == Event.event_id
        ).filter(
            Application.volunteer_id == volunteer_id
        ).all()
        
        result = []
        for app, event in applications:
            result.append({
                'application_id': app.application_id,
                'status': app.status,
                'confirmation_status': app.confirmation_status,
                'applied_at': app.applied_at.isoformat() if app.applied_at else None,
                'event': {
                    'event_id': event.event_id,
                    'title': event.title,
                    'location': event.location,
                    'event_date': event.event_date.isoformat() if event.event_date else None,
                    'event_time': event.event_time,
                    'category': event.category
                }
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500



# ----------------------------------------------------
# CANCEL APPLICATION
# ----------------------------------------------------
@volunteers_bp.route("/applications/<int:application_id>/cancel", methods=["DELETE"])
@jwt_required()
def cancel_application(application_id):
    try:
        volunteer_id = get_jwt_identity()
        
        application = Application.query.filter_by(
            application_id=application_id,
            volunteer_id=volunteer_id
        ).first()
        
        if not application:
            return jsonify({"message": "Application not found"}), 404
        
        if application.status != 'Pending':
            return jsonify({"message": "Can only cancel pending applications"}), 400
        
        db.session.delete(application)
        db.session.commit()
        
        return jsonify({"message": "Application cancelled successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500