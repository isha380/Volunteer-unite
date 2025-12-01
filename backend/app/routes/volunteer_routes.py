

from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.volunteer_model import Volunteer
import os

volunteers_bp = Blueprint('volunteers_bp', __name__,url_prefix='/volunteers')

# ----------------------------------------------------
# REGISTER A NEW VOLUNTEER
# ----------------------------------------------------
@volunteers_bp.route('/', methods=['POST', 'OPTIONS'])
def add_volunteer():
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        return jsonify({"message": "CORS OK"}), 200

    # Extract form-data fields
    fullname = request.form.get("fullname")
    email = request.form.get("email")
    phone = request.form.get("phone")
    password = request.form.get("password")
    skills = request.form.get("skills")
    availability = request.form.get("availability")
    photo = request.files.get("profile")

    # Validate required fields
    if not all([fullname, email, phone, password, skills]):
        return jsonify({"message": "Missing required fields"}), 400

    # Save uploaded profile image
    filename = None
    if photo:
        filename = photo.filename
        upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        photo.save(upload_path)

    # Create Volunteer Row
    volunteer = Volunteer(
        name=fullname,
        email=email,
        phone=phone,
        password_hash=generate_password_hash(password),
        skills=skills,
        availability=availability,
        profile=filename,
        role="volunteer"
    )

    # Insert into DB
    db.session.add(volunteer)
    db.session.commit()

    return jsonify({"message": "Registration successful"}), 201


# ----------------------------------------------------
# GET LOGGED-IN VOLUNTEER PROFILE
# ----------------------------------------------------
@volunteers_bp.route('/volunteer/profile', methods=['GET'])
@jwt_required()
def get_volunteer_profile():
    volunteer_id = get_jwt_identity()  # ID from JWT
    volunteer = Volunteer.query.get(volunteer_id)

    if not volunteer:
        return jsonify({"message": "Volunteer not found"}), 404

    return jsonify({
        "id": volunteer.id,
        "name": volunteer.name,
        "email": volunteer.email,
        "phone": volunteer.phone,
        "skills": volunteer.skills,
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

    # Update fields safely
    volunteer.name = data.get("name", volunteer.name)
    volunteer.phone = data.get("phone", volunteer.phone)
    volunteer.skills = data.get("skills", volunteer.skills)
    volunteer.availability = data.get("availability", volunteer.availability)

    db.session.commit()

    return jsonify({"message": "Profile updated successfully"}), 200
