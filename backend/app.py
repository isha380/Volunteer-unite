from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:5500", "http://127.0.0.1:5000"])

@app.route('/')
def home():
    return jsonify({"message": "Flask backend is working isha!"})

if __name__ == '__main__':
    app.run(debug=True)
