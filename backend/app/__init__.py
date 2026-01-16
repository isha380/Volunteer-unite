from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager  
import os    

db = SQLAlchemy()
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

    db.init_app(app)
    jwt.init_app(app) 

    
    CORS(app)

   
    from app.routes.auth_routes import auth_bp
    from app.routes.dashboard_routes import dashboard_bp
    from app.routes.volunteer_routes import volunteers_bp
    from app.routes.profile_routes import profile_bp
    from app.routes.event_routes import event_bp 
    from app.routes.admin_routes import admin_bp
    
    app.register_blueprint(admin_bp, url_prefix='/api/admin') 
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(dashboard_bp, url_prefix='/dashboard')
    app.register_blueprint(volunteers_bp, url_prefix='/volunteers')
    app.register_blueprint(profile_bp, url_prefix='/profile')
    app.register_blueprint(event_bp, url_prefix='/api') 
    
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