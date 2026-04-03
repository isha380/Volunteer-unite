from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.notification_model import Notification
from app.models.volunteer_model import Volunteer
from app.routes.auth_routes import admin_required
from datetime import datetime

notification_bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')


# ─────────────────────────────────────────
# ADMIN — Send message to a volunteer
# ─────────────────────────────────────────
@notification_bp.route('/send', methods=['POST'])
@jwt_required()
def send_notification():

    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        volunteer_id = data.get('volunteer_id')
        message      = data.get('message')

        if not volunteer_id or not message:
            return jsonify({'message': 'volunteer_id and message are required'}), 400

        volunteer = Volunteer.query.get(volunteer_id)
        if not volunteer:
            return jsonify({'message': 'Volunteer not found'}), 404

        notification = Notification(
            volunteer_id          = volunteer_id,
            message               = message,
            type                  = 'admin_message',
            sender                = 'admin',
            is_read               = False,
            status                = 'Unread',
            sent_at               = datetime.utcnow(),
            related_application_id = None,
            action_required        = False
        )

        db.session.add(notification)
        db.session.commit()

        return jsonify({'message': 'Message sent successfully'}), 201

    except Exception as e:
        db.session.rollback()
        print("SEND ERROR:", str(e))
        return jsonify({'error': str(e)}), 500


# ─────────────────────────────────────────
# VOLUNTEER — Reply to admin
# ─────────────────────────────────────────
@notification_bp.route('/reply', methods=['POST'])
@jwt_required()
def reply_to_admin():
    try:
        volunteer_id = get_jwt_identity()
        data         = request.get_json()
        message      = data.get('message')

        if not message:
            return jsonify({'message': 'Message is required'}), 400

        notification = Notification(
            volunteer_id = volunteer_id,
            message      = message,
            type         = 'volunteer_message',
            sender       = 'volunteer',
            is_read      = False,
            status       = 'Unread',
            sent_at      = datetime.utcnow()
        )

        db.session.add(notification)
        db.session.commit()

        return jsonify({'message': 'Reply sent successfully'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ─────────────────────────────────────────
# VOLUNTEER — Get their messages from admin
# ─────────────────────────────────────────
@notification_bp.route('/my-messages', methods=['GET'])
@jwt_required()
def get_my_messages():
    try:
        volunteer_id = get_jwt_identity()

        messages = Notification.query.filter_by(
            volunteer_id = volunteer_id,
            sender       = 'admin'
        ).order_by(Notification.sent_at.desc()).all()

        return jsonify([m.to_dict() for m in messages]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ─────────────────────────────────────────
# ADMIN — Get all messages from volunteers
# ─────────────────────────────────────────
@notification_bp.route('/admin/inbox', methods=['GET'])
@jwt_required()
def get_admin_inbox():
    try:
        messages = db.session.query(Notification, Volunteer).join(
            Volunteer, Notification.volunteer_id == Volunteer.volunteer_id
        ).filter(
            Notification.sender == 'volunteer'
        ).order_by(Notification.sent_at.desc()).all()

        result = []
        for notif, volunteer in messages:
            data = notif.to_dict()
            data['volunteer_name']  = volunteer.name
            data['volunteer_email'] = volunteer.email
            result.append(data)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ─────────────────────────────────────────
# BOTH — Mark message as read
# ─────────────────────────────────────────
@notification_bp.route('/<int:notification_id>/read', methods=['PATCH'])
@jwt_required()
def mark_as_read(notification_id):
    try:
        notification = Notification.query.get(notification_id)

        if not notification:
            return jsonify({'message': 'Notification not found'}), 404

        notification.is_read = True
        notification.status  = 'Read'
        db.session.commit()

        return jsonify({'message': 'Marked as read'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ─────────────────────────────────────────
# ADMIN — Search volunteers by name/email/event
# ─────────────────────────────────────────
# @notification_bp.route('/search-volunteers', methods=['GET'])
# @jwt_required()
# @admin_required
# def search_volunteers():
#     try:
#         query = request.args.get('q', '').strip()

#         if not query:
#             volunteers = Volunteer.query.limit(20).all()
#         else:
#             volunteers = Volunteer.query.filter(
#                 db.or_(
#                     Volunteer.name.ilike(f'%{query}%'),
#                     Volunteer.email.ilike(f'%{query}%'),
#                 )
#             ).limit(20).all()

#         result = []
#         for v in volunteers:
#             result.append({
#                 'volunteer_id': v.volunteer_id,
#                 'name':         v.name,
#                 'email':        v.email,
#                 'skills':       v.skills,
#             })

#         return jsonify(result), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
@notification_bp.route('/search-volunteers', methods=['GET', 'OPTIONS'])
@jwt_required()
def search_volunteers():
    if request.method == 'OPTIONS':
        return '', 204

    try:
        query = request.args.get('q', '').strip()

        if not query:
            volunteers = Volunteer.query.limit(20).all()
        else:
            volunteers = Volunteer.query.filter(
                db.or_(
                    Volunteer.name.ilike(f'%{query}%'),
                    Volunteer.email.ilike(f'%{query}%'),
                )
            ).limit(20).all()

        result = []
        for v in volunteers:
            result.append({
                'volunteer_id': v.volunteer_id,
                'name':         v.name,
                'email':        v.email,
                'skills':       v.skills,
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@notification_bp.route('/admin/sent', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_admin_sent():
    if request.method == 'OPTIONS':
        return '', 204
    try:
        messages = db.session.query(Notification, Volunteer).join(
            Volunteer, Notification.volunteer_id == Volunteer.volunteer_id
        ).filter(
            Notification.sender == 'admin'
        ).order_by(Notification.sent_at.desc()).all()

        result = []
        for notif, volunteer in messages:
            data = notif.to_dict()
            data['volunteer_name']  = volunteer.name
            data['volunteer_email'] = volunteer.email
            result.append(data)

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# VOLUNTEER — Get their own sent messages
@notification_bp.route('/my-sent', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_my_sent():
    if request.method == 'OPTIONS':
        return '', 204
    try:
        volunteer_id = get_jwt_identity()
        messages = Notification.query.filter_by(
            volunteer_id = volunteer_id,
            sender       = 'volunteer'
        ).order_by(Notification.sent_at.desc()).all()
        return jsonify([m.to_dict() for m in messages]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500