
# from flask import Blueprint, request, jsonify, current_app
# from flask_cors import CORS
# from werkzeug.security import check_password_hash, generate_password_hash
# from werkzeug.utils import secure_filename
# from flask_jwt_extended import create_access_token
# from app.models import User
# from app.models.volunteer_model import Volunteer
# from app import db
# import jwt
# import datetime
# import os
# from app.models.admin_model import Admin




# auth_bp = Blueprint('auth', __name__)
# CORS(auth_bp)


# # ------------------------------------------------------
# # REGISTER ROUTE (PROFILE IMAGE REQUIRED)
# # ------------------------------------------------------
# @auth_bp.route('/register', methods=['POST', 'OPTIONS'])
# def register():
#     if request.method == 'OPTIONS':
#         return '', 204

#     try:
        
#         print("Form:", request.form)
#         print("Files:", request.files)

        
#         name = request.form.get('name')
#         email = request.form.get('email')
#         phone = request.form.get('phone')
#         password = request.form.get('password')
#         skills = request.form.get('skills')
#         interests = request.form.get('interests')
#         availability = request.form.get('availability')

#         profile = request.files.get('profile') 

       
#         if not name or not email or not phone or not password or not skills or not profile:
#             return jsonify({"message": "Missing required fields"}), 400

        
#         existing_vol = Volunteer.query.filter_by(email=email).first()
#         if existing_vol:
#             return jsonify({"message": "User already exists"}), 400

        
#         profile_filename = secure_filename(profile.filename)
#         save_path = os.path.join(
#             current_app.config['UPLOAD_FOLDER'],
#             profile_filename
#         )
#         profile.save(save_path)

        
#         hashed_password = generate_password_hash(password)

        
#         new_volunteer = Volunteer(
#             name=name,
#             email=email,
#             phone=phone,
#             skills=skills,
#             interests=interests,
#             availability=availability,
#             profile=profile_filename,
#             password_hash=hashed_password,
#             role="volunteer"
#         )

#         db.session.add(new_volunteer)
#         db.session.commit()

#         return jsonify({
#             "message": "Volunteer registered successfully",
#             "user": {
#                 "volunteer_id": new_volunteer.volunteer_id,
#                 "name": new_volunteer.name,
#                 "email": new_volunteer.email,
#                 "phone": new_volunteer.phone,
#                 "profile": new_volunteer.profile
#             }
#         }), 201

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"message": f"Registration failed: {str(e)}"}), 500


# # ------------------------------------------------------
# # LOGIN ROUTE (checks both users and volunteers)
# # ------------------------------------------------------
# @auth_bp.route('/login', methods=['POST', 'OPTIONS'])
# def login():
#     if request.method == 'OPTIONS':
#         return '', 204

#     data = request.get_json() or {}
#     email = data.get('email')
#     password = data.get('password')

  
#     admin = Admin.query.filter_by(email=email).first()
#     if admin and check_password_hash(admin.password_hash, password):
#         token = create_access_token(
#             identity=str(admin.admin_id),              
#             additional_claims={"role": "admin"}        
#         )

#         return jsonify({
#             "message": "Admin login successful",
#             "access_token": token,
#             "user": {
#                 "id": admin.admin_id,
#                 "name": admin.name,
#                 "email": admin.email,
#                 "profile": admin.profile,
#                 "phone": admin.phone,
#                 "role": "admin"
#             }
#         }), 200

   
#     volunteer = Volunteer.query.filter_by(email=email).first()
#     if volunteer and check_password_hash(volunteer.password_hash, password):
#         token = create_access_token(
#             identity=str(volunteer.volunteer_id),      
#             additional_claims={"role": "volunteer"}    
#         )

#         return jsonify({
#             "message": "Volunteer login successful",
#             "access_token": token,
#             "user": {
#                 "id": volunteer.volunteer_id,
#                 "name": volunteer.name,
#                 "email": volunteer.email,
#                 "profile": volunteer.profile,
#                 "phone": volunteer.phone,
#                 "role": "volunteer"
#             }
#         }), 200

#     return jsonify({"message": "Invalid credentials"}), 401

from flask import Blueprint, request, jsonify, current_app
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from flask_jwt_extended import create_access_token, verify_jwt_in_request, get_jwt_identity, get_jwt
from app.models import User  # Keep this if you have a User model
from app.models.volunteer_model import Volunteer
from app.models.admin_model import Admin
from app import db
import jwt
import datetime
import os
from functools import wraps

auth_bp = Blueprint('auth', __name__)
CORS(auth_bp)

# ------------------------------------------------------
# MIDDLEWARE: JWT Required
# ------------------------------------------------------
def jwt_required_custom(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            verify_jwt_in_request()
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Invalid or missing token'}), 401
    return decorated_function

# ------------------------------------------------------
# MIDDLEWARE: Admin Required
# ------------------------------------------------------
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

# ------------------------------------------------------
# REGISTER ROUTE (VOLUNTEER - PROFILE IMAGE REQUIRED)
# ------------------------------------------------------
@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 204

    try:
        print("Form:", request.form)
        print("Files:", request.files)

        
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        password = request.form.get('password')
        skills = request.form.get('skills')
        interests = request.form.get('interests')
        availability = request.form.get('availability')

        profile = request.files.get('profile') 

        
        if not name or not email or not phone or not password or not skills or not profile:
            return jsonify({"message": "Missing required fields"}), 400

        
        existing_vol = Volunteer.query.filter_by(email=email).first()
        if existing_vol:
            return jsonify({"message": "Email already registered"}), 400

        
        existing_phone = Volunteer.query.filter_by(phone=phone).first()
        if existing_phone:
            return jsonify({"message": "Phone number already registered"}), 400

        
        profile_filename = secure_filename(profile.filename)
        save_path = os.path.join(
            current_app.config['UPLOAD_FOLDER'],
            profile_filename
        )
        profile.save(save_path)

        
        hashed_password = generate_password_hash(password)

       
        new_volunteer = Volunteer(
            name=name,
            email=email,
            phone=phone,
            skills=skills,
            interests=interests,
            availability=availability,
            profile=profile_filename,
            password_hash=hashed_password,
            role="volunteer"
        )

        db.session.add(new_volunteer)
        db.session.commit()

        
        token = create_access_token(
            identity=str(new_volunteer.volunteer_id),
            additional_claims={"role": "volunteer"}
        )

        return jsonify({
            "message": "Volunteer registered successfully",
            "access_token": token,
            "user": {
                "id": new_volunteer.volunteer_id,
                "name": new_volunteer.name,
                "email": new_volunteer.email,
                "phone": new_volunteer.phone,
                "profile": new_volunteer.profile,
                "role": "volunteer"
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {str(e)}")
        return jsonify({"message": f"Registration failed: {str(e)}"}), 500


# ------------------------------------------------------
# LOGIN ROUTE (checks both admins and volunteers)
# ------------------------------------------------------
@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 204

    try:
        data = request.get_json() or {}
        email = data.get('email')
        password = data.get('password')

       
        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

       
        admin = Admin.query.filter_by(email=email).first()
        if admin and check_password_hash(admin.password_hash, password):
            token = create_access_token(
                identity=str(admin.admin_id),              
                additional_claims={"role": "admin"}        
            )

            return jsonify({
                "message": "Admin login successful",
                "access_token": token,
                "user": {
                    "id": admin.admin_id,
                    "name": admin.name,
                    "email": admin.email,
                    "profile": admin.profile,
                    "phone": admin.phone,
                    "role": "admin"
                }
            }), 200

       
        volunteer = Volunteer.query.filter_by(email=email).first()
        if volunteer and check_password_hash(volunteer.password_hash, password):
            token = create_access_token(
                identity=str(volunteer.volunteer_id),      
                additional_claims={"role": "volunteer"}    
            )

            return jsonify({
                "message": "Volunteer login successful",
                "access_token": token,
                "user": {
                    "id": volunteer.volunteer_id,
                    "name": volunteer.name,
                    "email": volunteer.email,
                    "profile": volunteer.profile,
                    "phone": volunteer.phone,
                    "role": "volunteer"
                }
            }), 200

        
        return jsonify({"message": "Invalid email or password"}), 401

    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({"message": f"Login failed: {str(e)}"}), 500


# ------------------------------------------------------
# GET CURRENT USER 
# ------------------------------------------------------
@auth_bp.route('/me', methods=['GET'])
@jwt_required_custom
def get_current_user():
    try:
        user_id = get_jwt_identity()
        claims = get_jwt()
        role = claims.get('role')

        if role == 'admin':
            admin = Admin.query.get(user_id)
            if not admin:
                return jsonify({"message": "Admin not found"}), 404
            
            return jsonify({
                "user": {
                    "id": admin.admin_id,
                    "name": admin.name,
                    "email": admin.email,
                    "profile": admin.profile,
                    "phone": admin.phone,
                    "role": "admin",
                    "created_at": admin.created_at.isoformat() if admin.created_at else None
                }
            }), 200

        elif role == 'volunteer':
            volunteer = Volunteer.query.get(user_id)
            if not volunteer:
                return jsonify({"message": "Volunteer not found"}), 404
            
            return jsonify({
                "user": {
                    "id": volunteer.volunteer_id,
                    "name": volunteer.name,
                    "email": volunteer.email,
                    "profile": volunteer.profile,
                    "phone": volunteer.phone,
                    "skills": volunteer.skills,
                    "interests": volunteer.interests,
                    "availability": volunteer.availability,
                    "role": "volunteer"
                }
            }), 200

        return jsonify({"message": "Invalid role"}), 400

    except Exception as e:
        print(f"Get user error: {str(e)}")
        return jsonify({"message": f"Failed to fetch user: {str(e)}"}), 500


# ------------------------------------------------------
# CHANGE PASSWORD 
# ------------------------------------------------------
@auth_bp.route('/change-password', methods=['PUT'])
@jwt_required_custom
def change_password():
    try:
        user_id = get_jwt_identity()
        claims = get_jwt()
        role = claims.get('role')
        
        data = request.get_json()
        current_password = data.get('current_password')
        new_password = data.get('new_password')

        if not current_password or not new_password:
            return jsonify({"message": "Current and new password are required"}), 400

        if len(new_password) < 6:
            return jsonify({"message": "New password must be at least 6 characters"}), 400

        
        if role == 'admin':
            user = Admin.query.get(user_id)
        elif role == 'volunteer':
            user = Volunteer.query.get(user_id)
        else:
            return jsonify({"message": "Invalid role"}), 400

        if not user:
            return jsonify({"message": "User not found"}), 404

        
        if not check_password_hash(user.password_hash, current_password):
            return jsonify({"message": "Current password is incorrect"}), 401

     
        user.password_hash = generate_password_hash(new_password)
        db.session.commit()

        return jsonify({"message": "Password changed successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Change password error: {str(e)}")
        return jsonify({"message": f"Failed to change password: {str(e)}"}), 500


# ------------------------------------------------------
# LOGOUT (Optional - For Token Blacklisting)
# ------------------------------------------------------
@auth_bp.route('/logout', methods=['POST'])
@jwt_required_custom
def logout():
    # Note: JWT tokens are stateless, so logout is typically handled on frontend
    # by removing the token from storage. for server-side logout,
    # we need to implement token blacklisting with Redis or database.
    
    return jsonify({"message": "Logout successful"}), 200


# ------------------------------------------------------
# VERIFY TOKEN (Check if token is valid)
# ------------------------------------------------------
@auth_bp.route('/verify-token', methods=['GET'])
@jwt_required_custom
def verify_token():
    try:
        user_id = get_jwt_identity()
        claims = get_jwt()
        
        return jsonify({
            "valid": True,
            "user_id": user_id,
            "role": claims.get('role')
        }), 200
        
    except Exception as e:
        return jsonify({"valid": False, "message": str(e)}), 401