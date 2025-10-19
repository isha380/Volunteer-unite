from flask import Flask
from flask_cors import CORS

def create_app():
    # ✅ Step 1: Create app first
    app = Flask(__name__)

    # ✅ Step 2: Enable CORS
    CORS(app, resources={r"/*": {"origins": "*"}})

    # ✅ Step 3: Import and register blueprint
    from app.routes.volunteer_routes import volunteers_bp
    app.register_blueprint(volunteers_bp)

    # ✅ Step 4: Print only after app exists
    print("✅ Blueprints registered:", app.url_map)

    return app
