
# from flask import Blueprint, request, jsonify, current_app
# from flask_cors import CORS
# from werkzeug.security import check_password_hash, generate_password_hash
# from werkzeug.utils import secure_filename
# from app.models import User
# from app import db
# import jwt, datetime
# import os

# auth_bp = Blueprint('auth', __name__)
# CORS(auth_bp)

# # ------------------------------------------------------
# # ✅ REGISTER ROUTE WITH IMAGE & OTHER FIELDS
# # ------------------------------------------------------
# @auth_bp.route('/register', methods=['POST', 'OPTIONS'])
# def register():
#     if request.method == 'OPTIONS':
#         return '', 204

#     try:
#         # Use form-data (because of file upload)
#         name = request.form.get('name')
#         email = request.form.get('email')
#         phone = request.form.get('phone')
#         password = request.form.get('password')
#         skills = request.form.get('skills')
#         availability = request.form.get('availability')

#         profile = request.files.get('profile')  # image file

#         # Validate required fields
#         if not name or not email or not phone or not password or not skills:
#             return jsonify({"message": "Missing required fields"}), 400

#         # Check if user exists
#         existing_user = User.query.filter_by(email=email).first()
#         if existing_user:
#             return jsonify({"message": "User already exists"}), 400

#         # Save profile image
#         profile_filename = None
#         if profile:
#             profile_filename = secure_filename(profile.filename)

#             save_path = os.path.join(
#                 current_app.config['UPLOAD_FOLDER'], 
#                 profile_filename
#             )
#             profile.save(save_path)

#         # Hash password
#         hashed_password = generate_password_hash(password)

#         # Create new user object
#         new_user = User(
#             name=name,
#             email=email,
#             phone=phone,
#             skills=skills,
#             availability=availability,
#             profile=profile_filename,   # store filename
#             password_hash=hashed_password
#         )

#         db.session.add(new_user)
#         db.session.commit()

#         return jsonify({
#             "message": "User registered successfully",
#             "user": {
#                 "user_id": new_user.user_id,
#                 "name": new_user.name,
#                 "email": new_user.email,
#                 "phone": new_user.phone,
#                 "profile": new_user.profile
#             }
#         }), 201

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"message": f"Registration failed: {str(e)}"}), 500



# # ------------------------------------------------------
# # ✅ LOGIN ROUTE (NO CHANGE)
# # ------------------------------------------------------
# @auth_bp.route('/login', methods=['POST', 'OPTIONS'])
# def login():
#     if request.method == 'OPTIONS':
#         return '', 204

#     data = request.get_json() or {}
#     email = data.get('email')
#     password = data.get('password')

#     user = User.query.filter_by(email=email).first()
#     if not user or not check_password_hash(user.password_hash, password):
#         return jsonify({"message": "Invalid credentials"}), 401

#     token = jwt.encode({
#         "user_id": user.user_id,
#         "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=12)
#     }, current_app.config['SECRET_KEY'], algorithm="HS256")

#     return jsonify({
#         "message": "Login successful",
#         "token": token,
#         "user_id": user.user_id,
#         "user": {
#             "user_id": user.user_id,
#             "name": user.name,
#             "email": user.email,
#             "phone": user.phone,
#             "profile": user.profile
#         }
#     }), 200

#-----------------------------------------------------------------------------------------------------------------------

# from flask import Blueprint, request, jsonify
# from werkzeug.security import check_password_hash
# from flask_jwt_extended import create_access_token
# from app.models.volunteer_model import Volunteer

# auth_bp = Blueprint("auth_bp", __name__)

# @auth_bp.route("/auth/login", methods=["POST"])
# def login():
#     data = request.get_json()
#     email = data.get("email")
#     password = data.get("password")

#     volunteer = Volunteer.query.filter_by(email=email).first()
#     if not volunteer:
#         return jsonify({"message": "Invalid email"}), 400

#     if not check_password_hash(volunteer.password_hash, password):
#         return jsonify({"message": "Incorrect password"}), 400

#     token = create_access_token(identity=volunteer.id)

#     return jsonify({
#         "message": "Login successful",
#         "token": token,
#         "role": volunteer.role,
#         "name": volunteer.name
#     }), 200

#_____________________________________________________
# from flask import Blueprint, request, jsonify, current_app
# from flask_cors import CORS
# from werkzeug.security import check_password_hash, generate_password_hash
# from werkzeug.utils import secure_filename
# from app.models import User
# from app import db
# import jwt
# import datetime
# import os

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
#          # ---------------- Debug ----------------
#         print("Form:", request.form)
#         print("Files:", request.files)
#         # ---------------------------------------

#         # Read form-data fields
#         name = request.form.get('name')
#         email = request.form.get('email')
#         phone = request.form.get('phone')
#         password = request.form.get('password')
#         skills = request.form.get('skills')
#         availability = request.form.get('availability')

#         profile = request.files.get('profile')  # REQUIRED IMAGE

#         # Validate required fields (profile REQUIRED)
#         if not name or not email or not phone or not password or not skills or not profile:
#             return jsonify({"message": "Missing required fields"}), 400

#         # Check duplicate email
#         existing_user = User.query.filter_by(email=email).first()
#         if existing_user:
#             return jsonify({"message": "User already exists"}), 400

#         # Save profile image (required)
#         profile_filename = secure_filename(profile.filename)
#         save_path = os.path.join(
#             current_app.config['UPLOAD_FOLDER'],
#             profile_filename
#         )
#         profile.save(save_path)

#         # Hash password
#         hashed_password = generate_password_hash(password)

#         # Create user
#         new_user = User(
#             name=name,
#             email=email,
#             phone=phone,
#             skills=skills,
#             availability=availability,
#             profile=profile_filename,   # store filename only
#             password_hash=hashed_password
#         )

#         db.session.add(new_user)
#         db.session.commit()

#         return jsonify({
#             "message": "User registered successfully",
#             "user": {
#                 "user_id": new_user.user_id,
#                 "name": new_user.name,
#                 "email": new_user.email,
#                 "phone": new_user.phone,
#                 "profile": new_user.profile
#             }
#         }), 201

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"message": f"Registration failed: {str(e)}"}), 500


# # ------------------------------------------------------
# # LOGIN ROUTE
# # ------------------------------------------------------
# @auth_bp.route('/login', methods=['POST', 'OPTIONS'])
# def login():
#     if request.method == 'OPTIONS':
#         return '', 204

#     data = request.get_json() or {}
#     email = data.get('email')
#     password = data.get('password')

#     user = User.query.filter_by(email=email).first()

#     if not user or not check_password_hash(user.password_hash, password):
#         return jsonify({"message": "Invalid credentials"}), 401

#     # Create JWT token
#     token = jwt.encode({
#         "user_id": user.user_id,
#         "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=12)
#     }, current_app.config['SECRET_KEY'], algorithm="HS256")

#     return jsonify({
#         "message": "Login successful",
#         "token": token,
#         "user_id": user.user_id,
#         "user": {
#             "user_id": user.user_id,
#             "name": user.name,
#             "email": user.email,
#             "phone": user.phone,
#             "profile": user.profile
#         }
#     }), 200
#____________________________________________________________


from flask import Blueprint, request, jsonify, current_app
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from flask_jwt_extended import create_access_token
from app.models import User
from app.models.volunteer_model import Volunteer
from app import db
import jwt
import datetime
import os
from app.models.admin_model import Admin




auth_bp = Blueprint('auth', __name__)
CORS(auth_bp)


# ------------------------------------------------------
# REGISTER ROUTE (PROFILE IMAGE REQUIRED)
# ------------------------------------------------------
@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 204

    try:
        # Debug logs (optional)
        print("Form:", request.form)
        print("Files:", request.files)

        # Read form-data fields
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

        # Check duplicate email in volunteers (since you want to store volunteers there)
        existing_vol = Volunteer.query.filter_by(email=email).first()
        if existing_vol:
            return jsonify({"message": "User already exists"}), 400

        # Save profile image (required)
        profile_filename = secure_filename(profile.filename)
        save_path = os.path.join(
            current_app.config['UPLOAD_FOLDER'],
            profile_filename
        )
        profile.save(save_path)

        
        hashed_password = generate_password_hash(password)

        # Create volunteer (store in volunteers table)
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

        return jsonify({
            "message": "Volunteer registered successfully",
            "user": {
                "volunteer_id": new_volunteer.volunteer_id,
                "name": new_volunteer.name,
                "email": new_volunteer.email,
                "phone": new_volunteer.phone,
                "profile": new_volunteer.profile
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Registration failed: {str(e)}"}), 500


# ------------------------------------------------------
# LOGIN ROUTE (checks both users and volunteers)
# ------------------------------------------------------
@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 204

    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    # starting from admins table first
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

    return jsonify({"message": "Invalid credentials"}), 401