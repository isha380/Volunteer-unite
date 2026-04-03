
# from flask import Flask, send_from_directory
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager  
# import os      
# from dotenv import load_dotenv
# load_dotenv() 
# from app.extensions import db, mail 


# jwt = JWTManager() 

# def create_app():
#     app = Flask(__name__)

    
#     app.config['SECRET_KEY'] = 'secret_key_here'
#     app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost:5432/volunteer_unite'
#     app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#     UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'instance', 'profile_pics')
#     app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
#     app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024

#     # JWT configuration
#     app.config["JWT_SECRET_KEY"] = "super-secret-key"
#     app.config["JWT_TOKEN_LOCATION"] = ["headers"]
#     app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600  

#     db.init_app(app)
#     jwt.init_app(app) 
   

#     # CORS - MUST BE CONFIGURED PROPERLY
#     CORS(app, resources={
#         r"/*": {
#             "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
#             "methods": ["GET", "POST", "PUT", "DELETE","PATCH", "OPTIONS"],
#             "allow_headers": ["Content-Type", "Authorization"],
#             "supports_credentials": True
#         }
#     })

#     # Import blueprints
#     from app.routes.auth_routes import auth_bp
#     from app.routes.dashboard_routes import dashboard_bp
#     from app.routes.volunteer_routes import volunteers_bp
#     from app.routes.profile_routes import profile_bp
#     from app.routes.event_routes import events_bp 
#     from app.routes.admin_routes import admin_bp
#     from app.routes.attendance_routes import attendance_bp
#     from app.routes.badge_routes import badge_bp
#     from app.routes.dashboard_attendance_routes import dashboard_attendance_bp
    
#     # Register blueprints
#     app.register_blueprint(auth_bp, url_prefix='/auth')
#     app.register_blueprint(dashboard_bp, url_prefix='/dashboard')
#     app.register_blueprint(volunteers_bp, url_prefix='/volunteers')
#     app.register_blueprint(profile_bp, url_prefix='/profile')
#     app.register_blueprint(admin_bp, url_prefix='/api/admin')
#     app.register_blueprint(events_bp, url_prefix='/api/events')  
#     app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
#     app.register_blueprint(badge_bp, url_prefix='/api/badges')
#     app.register_blueprint(dashboard_attendance_bp, url_prefix='/api/dashboard')
#     @app.route('/')
#     def home():
#         return {"message": "Volunteer Unite backend is running successfully!"}
    
#     @app.route('/profile_pics/<filename>')
#     def serve_profile_image(filename):
#         return send_from_directory(
#             app.config['UPLOAD_FOLDER'],
#             filename
#         )

#     return app

from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager  
import os      
from dotenv import load_dotenv
load_dotenv() 
from app.extensions import db, mail 

jwt = JWTManager() 

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = 'secret_key_here'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost:5432/volunteer_unite'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'instance', 'profile_pics')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024

    # JWT configuration
    app.config["JWT_SECRET_KEY"] = "super-secret-key"
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600

    # Mail configuration 
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME')

    db.init_app(app)
    mail.init_app(app) 
    jwt.init_app(app) 

    # CORS
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE","PATCH", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    # Import blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.dashboard_routes import dashboard_bp
    from app.routes.volunteer_routes import volunteers_bp
    from app.routes.profile_routes import profile_bp
    from app.routes.event_routes import events_bp 
    from app.routes.admin_routes import admin_bp
    from app.routes.attendance_routes import attendance_bp
    from app.routes.badge_routes import badge_bp
    from app.routes.dashboard_attendance_routes import dashboard_attendance_bp
    from app.routes.notification_routes import notification_bp  
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(dashboard_bp, url_prefix='/dashboard')
    app.register_blueprint(volunteers_bp, url_prefix='/volunteers')
    app.register_blueprint(profile_bp, url_prefix='/profile')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(events_bp, url_prefix='/api/events')  
    app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
    app.register_blueprint(badge_bp, url_prefix='/api/badges')
    app.register_blueprint(dashboard_attendance_bp, url_prefix='/api/dashboard')
    app.register_blueprint(notification_bp) 
    
    @app.route('/')
    def home():
        return {"message": "Volunteer Unite backend is running successfully!"}
    
    @app.route('/profile_pics/<filename>')
    def serve_profile_image(filename):
        return send_from_directory(
            app.config['UPLOAD_FOLDER'],
            filename
        )

    return app

