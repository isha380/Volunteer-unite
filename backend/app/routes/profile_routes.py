from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.models.volunteer_model import Volunteer
from app.models.admin_model import Admin

profile_bp = Blueprint("profile", __name__)



@profile_bp.route("/me", methods=["GET"])
@jwt_required()
def get_my_profile():
    # user = get_jwt_identity()
    user_id = get_jwt_identity()
    # user_id = user["id"]
    # role = user["role"]
    claims = get_jwt()
    role = claims.get("role")
    if role == "volunteer":
        volunteer = Volunteer.query.get(user_id)
        if not volunteer:
            return jsonify({"message": "Volunteer not found"}), 404

        return jsonify({
            "name": volunteer.name,
            "email": volunteer.email,
            "skills": volunteer.skills,
            "interests": volunteer.interests,
            "availability": volunteer.availability,
            "profile": volunteer.profile
        }), 200

    if role == "admin":
        admin = Admin.query.get(user_id)
        if not admin:
            return jsonify({"message": "Admin not found"}), 404

        return jsonify({
            "name": admin.name,
            "email": admin.email,
            "profile": admin.profile
        }), 200

@profile_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_my_profile():
    # user = get_jwt_identity()
    # user_id = user["id"]
    # role = user["role"]
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get("role")

    data = request.get_json()

    if role == "volunteer":
        volunteer = Volunteer.query.get(user_id)
        if not volunteer:
            return jsonify({"message": "Volunteer not found"}), 404

        volunteer.skills = data.get("skills", volunteer.skills)
        volunteer.interests = data.get("interests", volunteer.interests)
        volunteer.availability = data.get("availability", volunteer.availability)
        volunteer.profile = data.get("profile", volunteer.profile)

        db.session.commit()
        return jsonify({"message": "Profile updated"}), 200

    if role == "admin":
        admin = Admin.query.get(user_id)
        if not admin:
            return jsonify({"message": "Admin not found"}), 404

        admin.profile = data.get("profile", admin.profile)
        db.session.commit()
        return jsonify({"message": "Profile updated"}), 200
