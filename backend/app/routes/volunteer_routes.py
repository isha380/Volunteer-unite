

# from flask import Blueprint, request, jsonify, current_app
# from werkzeug.security import generate_password_hash
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from app import db
# from app.models.volunteer_model import Volunteer
# import os

# volunteers_bp = Blueprint('volunteers_bp', __name__,url_prefix='/volunteers')

# # ----------------------------------------------------
# # REGISTER A NEW VOLUNTEER
# # ----------------------------------------------------
# @volunteers_bp.route('/', methods=['POST', 'OPTIONS'])
# def add_volunteer():
#     # Handle CORS preflight request
#     if request.method == 'OPTIONS':
#         return jsonify({"message": "CORS OK"}), 200

#     # Extract form-data fields
#     fullname = request.form.get("fullname")
#     email = request.form.get("email")
#     phone = request.form.get("phone")
#     password = request.form.get("password")
#     skills = request.form.get("skills")
#     availability = request.form.get("availability")
#     photo = request.files.get("profile")

#     # Validate required fields
#     if not all([fullname, email, phone, password, skills]):
#         return jsonify({"message": "Missing required fields"}), 400

#     # Save uploaded profile image
#     filename = None
#     if photo:
#         filename = photo.filename
#         upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
#         photo.save(upload_path)

#     # Create Volunteer Row
#     volunteer = Volunteer(
#         name=fullname,
#         email=email,
#         phone=phone,
#         password_hash=generate_password_hash(password),
#         skills=skills,
#         availability=availability,
#         profile=filename,
#         role="volunteer"
#     )

#     # Insert into DB
#     db.session.add(volunteer)
#     db.session.commit()

#     return jsonify({"message": "Registration successful"}), 201


# # ----------------------------------------------------
# # GET LOGGED-IN VOLUNTEER PROFILE
# # ----------------------------------------------------
# @volunteers_bp.route('/volunteer/profile', methods=['GET'])
# @jwt_required()
# def get_volunteer_profile():
#     volunteer_id = get_jwt_identity()  # ID from JWT
#     volunteer = Volunteer.query.get(volunteer_id)

#     if not volunteer:
#         return jsonify({"message": "Volunteer not found"}), 404

#     return jsonify({
#         "id": volunteer.id,
#         "name": volunteer.name,
#         "email": volunteer.email,
#         "phone": volunteer.phone,
#         "skills": volunteer.skills,
#         "availability": volunteer.availability,
#         "profile": volunteer.profile,
#         "role": volunteer.role,
#         "created_at": volunteer.created_at
#     }), 200


# # ----------------------------------------------------
# # UPDATE VOLUNTEER PROFILE
# # ----------------------------------------------------
# @volunteers_bp.route('/volunteer/profile', methods=['PUT'])
# @jwt_required()
# def update_volunteer_profile():
#     volunteer_id = get_jwt_identity()
#     volunteer = Volunteer.query.get(volunteer_id)

#     if not volunteer:
#         return jsonify({"message": "Volunteer not found"}), 404

#     data = request.get_json()

#     # Update fields safely
#     volunteer.name = data.get("name", volunteer.name)
#     volunteer.phone = data.get("phone", volunteer.phone)
#     volunteer.skills = data.get("skills", volunteer.skills)
#     volunteer.availability = data.get("availability", volunteer.availability)

#     db.session.commit()

#     return jsonify({"message": "Profile updated successfully"}), 200
# # ----------------------------------------------------

# from flask import Blueprint, request, jsonify, current_app
# from werkzeug.security import generate_password_hash
# from flask_jwt_extended import jwt_required, get_jwt_identity
# from app import db
# from app.models.volunteer_model import Volunteer
# from sqlalchemy import text  # <-- needed for raw SQL queries
# import os
# from flask_cors import CORS



# volunteers_bp = Blueprint('volunteers_bp', __name__, url_prefix='/volunteers')
# CORS(volunteers_bp)

# @volunteers_bp.route('/volunteer/profile', methods=['GET', 'OPTIONS'])
# @jwt_required(optional=True)
# def get_volunteer_profile():
#     if request.method == "OPTIONS":
#         return jsonify({"message": "CORS OK"}), 200

# # ----------------------------------------------------
# # REGISTER A NEW VOLUNTEER
# # ----------------------------------------------------
# @volunteers_bp.route('/', methods=['POST', 'OPTIONS'])
# def add_volunteer():
#     if request.method == 'OPTIONS':
#         return jsonify({"message": "CORS OK"}), 200

#     fullname = request.form.get("fullname")
#     email = request.form.get("email")
#     phone = request.form.get("phone")
#     password = request.form.get("password")
#     skills = request.form.get("skills")
#     availability = request.form.get("availability")
#     photo = request.files.get("profile")

#     if not all([fullname, email, phone, password, skills]):
#         return jsonify({"message": "Missing required fields"}), 400

#     filename = None
#     if photo:
#         filename = photo.filename
#         upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
#         photo.save(upload_path)

#     volunteer = Volunteer(
#         name=fullname,
#         email=email,
#         phone=phone,
#         password_hash=generate_password_hash(password),
#         skills=skills,
#         availability=availability,
#         profile=filename,
#         role="volunteer"
#     )

#     db.session.add(volunteer)
#     db.session.commit()

#     return jsonify({"message": "Registration successful"}), 201


# # ----------------------------------------------------
# # GET LOGGED-IN VOLUNTEER PROFILE
# # ----------------------------------------------------
# @volunteers_bp.route('/volunteer/profile', methods=['GET'])
# @jwt_required()
# def get_volunteer_profile():
#     volunteer_id = get_jwt_identity()
#     volunteer = Volunteer.query.get(volunteer_id)

#     if not volunteer:
#         return jsonify({"message": "Volunteer not found"}), 404

#     return jsonify({
#         "id": volunteer.id,
#         "name": volunteer.name,
#         "email": volunteer.email,
#         "phone": volunteer.phone,
#         "skills": volunteer.skills,
#         "availability": volunteer.availability,
#         "profile": volunteer.profile,
#         "role": volunteer.role,
#         "created_at": volunteer.created_at
#     }), 200


# # ----------------------------------------------------
# # UPDATE VOLUNTEER PROFILE
# # ----------------------------------------------------
# @volunteers_bp.route('/volunteer/profile', methods=['PUT'])
# @jwt_required()
# def update_volunteer_profile():
#     volunteer_id = get_jwt_identity()
#     volunteer = Volunteer.query.get(volunteer_id)

#     if not volunteer:
#         return jsonify({"message": "Volunteer not found"}), 404

#     data = request.get_json()

#     volunteer.name = data.get("name", volunteer.name)
#     volunteer.phone = data.get("phone", volunteer.phone)
#     volunteer.skills = data.get("skills", volunteer.skills)
#     volunteer.availability = data.get("availability", volunteer.availability)

#     db.session.commit()

#     return jsonify({"message": "Profile updated successfully"}), 200


# # ----------------------------------------------------
# # DASHBOARD STATS FOR VOLUNTEER
# # ----------------------------------------------------
# @volunteers_bp.route('/dashboard-stats', methods=['GET'])
# def dashboard_stats():
#     # Active events count
#     active_events = db.session.execute(
#         text("SELECT COUNT(*) FROM events WHERE status='ACTIVE'")
#     ).scalar()

#     # Total volunteers
#     total_volunteers = db.session.execute(
#         text("SELECT COUNT(*) FROM volunteers")
#     ).scalar()

#     # Urgent events (category = 'Emergency')
#     urgent_events = db.session.execute(
#         text("SELECT COUNT(*) FROM events WHERE category='Emergency'")
#     ).scalar()

#     return jsonify({
#         "activeEvents": active_events,
#         "totalVolunteers": total_volunteers,
#         "urgentEvents": urgent_events
#     })

# # ----------------------------------------------------

from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.volunteer_model import Volunteer
from sqlalchemy import text
import os
from flask_cors import CORS

volunteers_bp = Blueprint('volunteers_bp', __name__, url_prefix='/volunteers')
CORS(volunteers_bp)

# ----------------------------------------------------
# REGISTER A NEW VOLUNTEER
# ----------------------------------------------------
@volunteers_bp.route('/', methods=['POST', 'OPTIONS'])
def add_volunteer():
    if request.method == 'OPTIONS':
        return jsonify({"message": "CORS OK"}), 200

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
@jwt_required()
def get_volunteer_profile():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS OK"}), 200

    volunteer_id = get_jwt_identity()
    volunteer = Volunteer.query.get(volunteer_id)

    if not volunteer:
        return jsonify({"message": "Volunteer not found"}), 404

    return jsonify({
        "id": volunteer.id,
        "name": volunteer.name,
        "email": volunteer.email,
        "phone": volunteer.phone,
        "skills": volunteer.skills.split(",") if volunteer.skills else [],
        "interests": volunteer.interests.split(",") if volunteer.interests else [],
        "availability": volunteer.availability,
        "profile": volunteer.profile,
        "role": volunteer.role,
        "created_at": volunteer.created_at
    }), 200


# ----------------------------------------------------
# UPDATE VOLUNTEER PROFILE
# ----------------------------------------------------
@volunteers_bp.route('/volunteer/profile', methods=['PUT'])
@jwt_required()
def update_volunteer_profile():
    volunteer_id = get_jwt_identity()
    volunteer = Volunteer.query.get(volunteer_id)

    if not volunteer:
        return jsonify({"message": "Volunteer not found"}), 404

    data = request.get_json()

    volunteer.name = data.get("name", volunteer.name)
    volunteer.phone = data.get("phone", volunteer.phone)
    volunteer.skills = data.get("skills", volunteer.skills)
    volunteer.interests = data.get("interests", volunteer.interests)
    volunteer.availability = data.get("availability", volunteer.availability)
    
    photo = request.files.get("profile")
    if photo:
        filename = photo.filename
        photo.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        volunteer.profile = filename

    db.session.commit()

    return jsonify({"message": "Profile updated successfully"}), 200


# ----------------------------------------------------
# DASHBOARD STATS FOR VOLUNTEER
# ----------------------------------------------------
@volunteers_bp.route('/dashboard-stats', methods=['GET'])
def dashboard_stats():
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
