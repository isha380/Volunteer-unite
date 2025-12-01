
# import sys
# import os
# from flask import Flask, jsonify
# from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
# from flask_jwt_extended import JWTManager

# # Initialize Flask app
# app = Flask(__name__)
# CORS(app, origins=["http://127.0.0.1:5500", "http://localhost:5500"])

# # Configurations (adjust if needed)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///volunteers.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this later

# # Initialize extensions
# db = SQLAlchemy(app)
# jwt = JWTManager(app)

# # Import Blueprints
# from app.routes.volunteer_routes import volunteers_bp

# # Register Blueprint
# app.register_blueprint(volunteers_bp, url_prefix='/api')

# @app.route('/')
# def home():
#     return jsonify({"message": "Volunteer Unite backend is running successfully!"})

# if __name__ == '__main__':
#     app.run(debug=True)

from app import create_app, db

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)


