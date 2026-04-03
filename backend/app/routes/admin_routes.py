

# # from flask import Blueprint, request, jsonify
# # from app import db
# # from app.models.event_model import Event
# # from app.models.application_model import Application
# # from app.models.volunteer_model import Volunteer
# # from functools import wraps
# # from flask_jwt_extended import verify_jwt_in_request, get_jwt, jwt_required
# # from app.routes.auth_routes import admin_required
# # #------------------------------------------------


# # from app.models.event_volunteer_match_model import EventVolunteerMatch
# # from app.models.volunteer_model import Volunteer

# # admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')


# # # GET DASHBOARD STATISTICS
# # @admin_bp.route('/stats', methods=['GET'])
# # @jwt_required()
# # @admin_required
# # def get_dashboard_stats():
# #     try:
# #         total_events = Event.query.filter_by(status='Active').count()
# #         total_applicants = Application.query.count()
# #         approved = Application.query.filter_by(status='Approved').count()
# #         pending = Application.query.filter_by(status='Pending').count()
        
# #         return jsonify({
# #             'total_events': total_events,
# #             'total_applicants': total_applicants,
# #             'approved': approved,
# #             'pending': pending
# #         }), 200
        
# #     except Exception as e:
# #         return jsonify({'error': str(e)}), 500


# from flask import Blueprint, request, jsonify
# from app import db
# from app.models.event_model import Event
# from app.models.application_model import Application
# from app.models.volunteer_model import Volunteer
# from functools import wraps
# from flask_jwt_extended import verify_jwt_in_request, get_jwt, jwt_required
# from app.routes.auth_routes import admin_required
# #------------------------------------------------


# from app.models.event_volunteer_match_model import EventVolunteerMatch
# from app.models.volunteer_model import Volunteer

# admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')


# # GET DASHBOARD STATISTICS
# @admin_bp.route('/stats', methods=['GET'])
# @jwt_required()
# @admin_required
# def get_dashboard_stats():
#     try:
#         total_events = Event.query.filter_by(status='Active').count()
#         total_applicants = Application.query.count()
#         approved = Application.query.filter_by(status='Approved').count()
#         pending = Application.query.filter_by(status='Pending').count()
        
#         return jsonify({
#             'total_events': total_events,
#             'total_applicants': total_applicants,
#             'approved': approved,
#             'pending': pending
#         }), 200
        
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# # GET ALL APPLICATIONS (with optional status filter)
# @admin_bp.route("/applications", methods=["GET"])
# @jwt_required()
# @admin_required
# def get_all_applications():
#     try:
#         status_filter = request.args.get('status')  # Optional: Pending, Approved, Rejected
        
#         query = db.session.query(
#             Application, Volunteer, Event
#         ).join(
#             Volunteer, Application.volunteer_id == Volunteer.volunteer_id
#         ).join(
#             Event, Application.event_id == Event.event_id
#         )
        
#         if status_filter:
#             query = query.filter(Application.status == status_filter)
        
#         applications = query.order_by(Application.applied_at.desc()).all()
        
#         result = []
#         for app, volunteer, event in applications:
#             result.append({
#                 'application_id': app.application_id,
#                 'status': app.status,
#                 'confirmation_status': app.confirmation_status,
#                 'applied_at': app.applied_at.isoformat() if app.applied_at else None,
#                 'volunteer': {
#                     'volunteer_id': volunteer.volunteer_id,
#                     'name': volunteer.name,
#                     'email': volunteer.email,
#                     'phone': volunteer.phone,
#                     # FIX: Convert skills string to array
#                     'skills': volunteer.skills.split(",") if volunteer.skills else [],
#                     'profile': volunteer.profile
#                 },
#                 'event': {
#                     'event_id': event.event_id,
#                     'title': event.title,
#                     'description': event.description,
#                     'location': event.location,
#                     'event_date': event.event_date.isoformat() if event.event_date else None,
#                     'event_time': event.event_time,
#                     'category': event.category
#                 }
#             })
        
#         return jsonify(result), 200
        
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# #  APPROVE/REJECT APPLICATION
# @admin_bp.route("/applications/<int:application_id>", methods=["PATCH"])
# @jwt_required()
# @admin_required
# def update_application_status(application_id):
#     try:
#         data = request.get_json()
#         status = data.get("status")
        
      
#         valid_statuses = ["Approved", "Rejected"]
#         if status not in valid_statuses:
#             return jsonify({"message": "Invalid status. Must be 'Approved' or 'Rejected'"}), 400

      
#         application = Application.query.get(application_id)
        
#         if not application:
#             return jsonify({"message": "Application not found"}), 404

#         # Check if already processed
#         if application.status != 'Pending':
#             return jsonify({"message": "Application has already been processed"}), 400

      
#         application.status = status
        
       
#         if status == 'Approved':
#             application.confirmation_status = 'Pending'
        
#         db.session.commit()

#         return jsonify({"message": f"Application {status.lower()}"}), 200
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 500


# # GET SINGLE APPLICATION DETAILS
# @admin_bp.route("/applications/<int:application_id>", methods=["GET"])
# @jwt_required()
# @admin_required
# def get_application_details(application_id):
#     try:
#         result = db.session.query(
#             Application, Volunteer, Event
#         ).join(
#             Volunteer, Application.volunteer_id == Volunteer.volunteer_id
#         ).join(
#             Event, Application.event_id == Event.event_id
#         ).filter(
#             Application.application_id == application_id
#         ).first()
        
#         if not result:
#             return jsonify({'message': 'Application not found'}), 404
        
#         app, volunteer, event = result
        
#         return jsonify({
#             'application_id': app.application_id,
#             'status': app.status,
#             'confirmation_status': app.confirmation_status,
#             'applied_at': app.applied_at.isoformat() if app.applied_at else None,
#             'volunteer': {
#                 'volunteer_id': volunteer.volunteer_id,
#                 'name': volunteer.name,
#                 'email': volunteer.email,
#                 'phone': volunteer.phone,
#                 # FIX: Convert skills and interests strings to arrays
#                 'skills': volunteer.skills.split(",") if volunteer.skills else [],
#                 'interests': volunteer.interests.split(",") if volunteer.interests else [],
#                 'availability': volunteer.availability,
#                 'profile': volunteer.profile
#             },
#             'event': {
#                 'event_id': event.event_id,
#                 'title': event.title,
#                 'description': event.description,
#                 'location': event.location,
#                 'event_date': event.event_date.isoformat() if event.event_date else None,
#                 'event_time': event.event_time,
#                 'category': event.category,
#                 'required_skills': event.required_skills
#             }
#         }), 200
        
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # GET VOLUNTEER MATCHES FOR AN EVENT
# @admin_bp.route('/events/<int:event_id>/matches', methods=['GET'])
# @jwt_required()
# @admin_required
# def get_event_matches(event_id):

#     matches = (
#         db.session.query(EventVolunteerMatch, Volunteer)
#         .join(Volunteer, EventVolunteerMatch.volunteer_id == Volunteer.volunteer_id)
#         .filter(EventVolunteerMatch.event_id == event_id)
#         .order_by(EventVolunteerMatch.match_score.desc())
#         .all()
#     )

#     response = []

#     for match, volunteer in matches:
#         response.append({
#             "volunteer_id": volunteer.volunteer_id,
#             "name": volunteer.name,
#             "skills": volunteer.skills,
#             "availability": volunteer.availability,
#             "match_score": match.match_score
#         })

#     return jsonify(response), 200

#     # GET APPLIED VOLUNTEERS RANKING FOR AN EVENT (TAB 1)
# @admin_bp.route('/events/<int:event_id>/applied-matches', methods=['GET'])
# @jwt_required()
# @admin_required
# def get_event_applied_matches(event_id):
#     from app.services.matching import get_applied_ranking

#     matches = get_applied_ranking(event_id)

#     response = []
#     for match in matches:
#         volunteer = Volunteer.query.get(match.volunteer_id)
#         response.append({
#             "volunteer_id": volunteer.volunteer_id,
#             "name": volunteer.name,
#             "skills": volunteer.skills,
#             "availability": volunteer.availability,
#             "match_score": match.match_score,
#             "keyword_score": match.keyword_score,
#             "availability_bonus": match.availability_bonus
#         })

#     return jsonify(response), 200
# # Greedy Assignment — trigger via API
# @admin_bp.route('/events/<int:event_id>/greedy-assign', methods=['POST'])
# @jwt_required()
# @admin_required
# def trigger_greedy_assign(event_id):
#     from app.services.matching import greedy_assign

#     result = greedy_assign(event_id)

#     if "error" in result:
#         return jsonify(result), 404

#     return jsonify(result), 200

from flask import Blueprint, request, jsonify
from app import db
from app.models.event_model import Event
from app.models.application_model import Application
from app.models.volunteer_model import Volunteer
from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt, jwt_required
from app.routes.auth_routes import admin_required
from app.services.email_services import send_email  

#------------------------------------------------

from app.models.event_volunteer_match_model import EventVolunteerMatch
from app.models.volunteer_model import Volunteer

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

# ✅ TEMPORARY TEST ROUTE — remove after testing
@admin_bp.route('/test-email', methods=['GET'])
def test_email():
    try:
        import os
        print("MAIL_USERNAME:", os.environ.get('MAIL_USERNAME'))
        print("MAIL_PASSWORD:", os.environ.get('MAIL_PASSWORD'))
        send_email(
            to='ishamagar308@gmail.com',
            subject='Test Email from Volunteer Unite',
            body='Hello! Email is working! ✅'
        )
        return jsonify({'message': 'Email sent successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# GET DASHBOARD STATISTICS
@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
@admin_required
def get_dashboard_stats():
    try:
        total_events = Event.query.filter_by(status='Active').count()
        total_applicants = Application.query.count()
        approved = Application.query.filter_by(status='Approved').count()
        pending = Application.query.filter_by(status='Pending').count()
        
        return jsonify({
            'total_events': total_events,
            'total_applicants': total_applicants,
            'approved': approved,
            'pending': pending
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# GET ALL APPLICATIONS (with optional status filter)
@admin_bp.route("/applications", methods=["GET"])
@jwt_required()
@admin_required
def get_all_applications():
    try:
        status_filter = request.args.get('status')
        
        query = db.session.query(
            Application, Volunteer, Event
        ).join(
            Volunteer, Application.volunteer_id == Volunteer.volunteer_id
        ).join(
            Event, Application.event_id == Event.event_id
        )
        
        if status_filter:
            query = query.filter(Application.status == status_filter)
        
        applications = query.order_by(Application.applied_at.desc()).all()
        
        result = []
        for app, volunteer, event in applications:
            result.append({
                'application_id': app.application_id,
                'status': app.status,
                'confirmation_status': app.confirmation_status,
                'applied_at': app.applied_at.isoformat() if app.applied_at else None,
                'volunteer': {
                    'volunteer_id': volunteer.volunteer_id,
                    'name': volunteer.name,
                    'email': volunteer.email,
                    'phone': volunteer.phone,
                    'skills': volunteer.skills.split(",") if volunteer.skills else [],
                    'profile': volunteer.profile
                },
                'event': {
                    'event_id': event.event_id,
                    'title': event.title,
                    'description': event.description,
                    'location': event.location,
                    'event_date': event.event_date.isoformat() if event.event_date else None,
                    'event_time': event.event_time,
                    'category': event.category
                }
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# APPROVE/REJECT APPLICATION
@admin_bp.route("/applications/<int:application_id>", methods=["PATCH"])
@jwt_required()
@admin_required
def update_application_status(application_id):
    try:
        data = request.get_json()
        status = data.get("status")
        
        valid_statuses = ["Approved", "Rejected"]
        if status not in valid_statuses:
            return jsonify({"message": "Invalid status. Must be 'Approved' or 'Rejected'"}), 400

        application = Application.query.get(application_id)
        
        if not application:
            return jsonify({"message": "Application not found"}), 404

        if application.status != 'Pending':
            return jsonify({"message": "Application has already been processed"}), 400

        application.status = status
        
        if status == 'Approved':
            application.confirmation_status = 'Pending'

            # Send approval email
            volunteer = Volunteer.query.get(application.volunteer_id)
            event = Event.query.get(application.event_id)

            if volunteer and event:
                send_email(
                    to=volunteer.email,
                    subject="Application Approved!",
                    body=(
                        f"Hello {volunteer.name},\n\n"
                        f"Congratulations! You have been approved for the event '{event.title}'.We're excited to have you on this journey.\n\n"
                        f"Date: {event.event_date}\n"
                        f"Time: {event.event_time}\n"
                        f"Location: {event.location}\n\n"
                        f"Thank you for volunteering!\n\n"
                        f"Volunteer Unite Team"
                    )
                )

        db.session.commit()

        return jsonify({"message": f"Application {status.lower()}"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# GET SINGLE APPLICATION DETAILS
@admin_bp.route("/applications/<int:application_id>", methods=["GET"])
@jwt_required()
@admin_required
def get_application_details(application_id):
    try:
        result = db.session.query(
            Application, Volunteer, Event
        ).join(
            Volunteer, Application.volunteer_id == Volunteer.volunteer_id
        ).join(
            Event, Application.event_id == Event.event_id
        ).filter(
            Application.application_id == application_id
        ).first()
        
        if not result:
            return jsonify({'message': 'Application not found'}), 404
        
        app, volunteer, event = result
        
        return jsonify({
            'application_id': app.application_id,
            'status': app.status,
            'confirmation_status': app.confirmation_status,
            'applied_at': app.applied_at.isoformat() if app.applied_at else None,
            'volunteer': {
                'volunteer_id': volunteer.volunteer_id,
                'name': volunteer.name,
                'email': volunteer.email,
                'phone': volunteer.phone,
                'skills': volunteer.skills.split(",") if volunteer.skills else [],
                'interests': volunteer.interests.split(",") if volunteer.interests else [],
                'availability': volunteer.availability,
                'profile': volunteer.profile
            },
            'event': {
                'event_id': event.event_id,
                'title': event.title,
                'description': event.description,
                'location': event.location,
                'event_date': event.event_date.isoformat() if event.event_date else None,
                'event_time': event.event_time,
                'category': event.category,
                'required_skills': event.required_skills
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# GET VOLUNTEER MATCHES FOR AN EVENT
@admin_bp.route('/events/<int:event_id>/matches', methods=['GET'])
@jwt_required()
@admin_required
def get_event_matches(event_id):

    matches = (
        db.session.query(EventVolunteerMatch, Volunteer)
        .join(Volunteer, EventVolunteerMatch.volunteer_id == Volunteer.volunteer_id)
        .filter(EventVolunteerMatch.event_id == event_id)
        .order_by(EventVolunteerMatch.match_score.desc())
        .all()
    )

    response = []

    for match, volunteer in matches:
        response.append({
            "volunteer_id": volunteer.volunteer_id,
            "name": volunteer.name,
            "skills": volunteer.skills,
            "availability": volunteer.availability,
            "match_score": match.match_score
        })

    return jsonify(response), 200


# GET APPLIED VOLUNTEERS RANKING FOR AN EVENT (TAB 1)
@admin_bp.route('/events/<int:event_id>/applied-matches', methods=['GET'])
@jwt_required()
@admin_required
def get_event_applied_matches(event_id):
    from app.services.matching import get_applied_ranking

    matches = get_applied_ranking(event_id)

    response = []
    for match in matches:
        volunteer = Volunteer.query.get(match.volunteer_id)
        response.append({
            "volunteer_id": volunteer.volunteer_id,
            "name": volunteer.name,
            "skills": volunteer.skills,
            "availability": volunteer.availability,
            "match_score": match.match_score,
            "keyword_score": match.keyword_score,
            "availability_bonus": match.availability_bonus
        })

    return jsonify(response), 200


# Greedy Assignment — trigger via API
@admin_bp.route('/events/<int:event_id>/greedy-assign', methods=['POST'])
@jwt_required()
@admin_required
def trigger_greedy_assign(event_id):
    from app.services.matching import greedy_assign

    result = greedy_assign(event_id)

    if "error" in result:
        return jsonify(result), 404

    return jsonify(result), 200

