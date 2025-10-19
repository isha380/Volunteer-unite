# from flask import Blueprint, request, jsonify

# volunteers_bp = Blueprint('volunteers', __name__)

# @volunteers_bp.route('/volunteers', methods=['POST', 'OPTIONS'])
# def add_volunteer():
#     if request.method == 'OPTIONS':
#         # Preflight request response
#         response = jsonify({'message': 'CORS preflight successful'})
#         response.headers.add('Access-Control-Allow-Origin', '*')
#         response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
#         response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
#         return response, 200

#     data = request.get_json()
#     print(data)
#     return jsonify({'message': 'Volunteer added successfully', 'data': data}), 200
from flask import Blueprint, request, jsonify

volunteers_bp = Blueprint('volunteers_bp', __name__)

@volunteers_bp.route('/volunteers', methods=['POST', 'OPTIONS'])
def add_volunteer():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS preflight success'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response, 200

    data = request.get_json()
    print(data)
    return jsonify({'message': 'Volunteer added successfully', 'data': data}), 200
