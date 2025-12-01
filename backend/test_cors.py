# from flask import Flask
# from flask_cors import CORS

# app = Flask(__name__)

# # Allow requests from your frontend (127.0.0.1:5500)
# CORS(app, origins=["http://127.0.0.1:5500"])

# @app.route("/test")
# def test():
#     return {"message": "CORS is working!"}

# if __name__ == "__main__":
#     app.run(debug=True)
# -------------------------------------------------------------------------------------
from app import create_app

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        print("Testing CORS configuration...")
        print(f"Registered routes:")
        for rule in app.url_map.iter_rules():
            print(f"  {rule.endpoint}: {rule.rule} [{', '.join(rule.methods)}]")
    
    app.run(debug=True, port=5000)