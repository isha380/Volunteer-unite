


from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os    

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = 'your_secret_key_here'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost:5432/volunteer_unite'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # ✅ Add image upload configurations
    app.config['UPLOAD_FOLDER'] = 'instance/profile_pics'  # where images will be saved
    
    app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024      # max size 5MB

    db.init_app(app)

    # CORS allow everything (for debugging)
    CORS(app)

    # Import and register blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.dashboard_routes import dashboard_bp
    from app.routes.volunteer_routes import volunteers_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(dashboard_bp, url_prefix='/dashboard')
    app.register_blueprint(volunteers_bp, url_prefix='/volunteers')
    
    @app.route('/')
    def home():
        return {"message": "Volunteer Unite backend is running successfully!"}

    return app
