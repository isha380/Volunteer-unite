# from flask import Blueprint, request, jsonify
# from app.models.attendance_model import Attendance, AttendanceStatus
# from app.models.application_model import Application
# from app.extensions import db
# from datetime import datetime

# attendance_bp = Blueprint('attendance', __name__)

# @attendance_bp.route('/mark', methods=['POST'])
# def mark_attendance():
#     data = request.get_json()

#     application_id = data.get('application_id')
#     status = data.get('status')
#     remarks = data.get('remarks')
#     marked_by = data.get('marked_by')

#     application = Application.query.get(application_id)
#     if not application:
#         return jsonify({"error": "Application not found"}), 404

#     attendance = Attendance.query.filter_by(application_id=application_id).first()

#     if not attendance:
#         attendance = Attendance(
#             application_id=application_id,
#             volunteer_id=application.volunteer_id,
#             event_id=application.event_id,
#             status=AttendanceStatus[status],
#             remarks=remarks,
#             marked_by=marked_by,
#             marked_at=datetime.utcnow()
#         )
#         db.session.add(attendance)
#     else:
#         attendance.status = AttendanceStatus[status]
#         attendance.remarks = remarks
#         attendance.marked_by = marked_by
#         attendance.marked_at = datetime.utcnow()

#     db.session.commit()
#     return jsonify({"message": "Attendance marked successfully"})


# @attendance_bp.route('/event/<int:event_id>', methods=['GET'])
# def get_event_attendance(event_id):
#     records = Attendance.query.filter_by(event_id=event_id).all()
#     result = []
#     for r in records:
#         result.append({
#             "attendance_id": r.attendance_id,
#             "application_id": r.application_id,
#             "volunteer_id": r.volunteer_id,
#             "status": r.status.value,   # ← .value to serialize Enum
#             "remarks": r.remarks,
#             "marked_by": r.marked_by,
#             "marked_at": r.marked_at
#         })
#     return jsonify(result)


# @attendance_bp.route('/volunteer/<int:volunteer_id>', methods=['GET'])
# def get_volunteer_attendance(volunteer_id):
#     records = Attendance.query.filter_by(volunteer_id=volunteer_id).all()
#     result = []
#     for r in records:
#         result.append({
#             "event_id": r.event_id,
#             "status": r.status.value,   # ← .value to serialize Enum
#             "remarks": r.remarks,
#             "marked_at": r.marked_at
#         })
#     return jsonify(result)


#=======================================================

from flask import Blueprint, request, jsonify
from app.models.attendance_model import Attendance, AttendanceStatus
from app.models.application_model import Application
from app.models.badge_model import Badge, VolunteerBadge
from app.extensions import db
from datetime import datetime

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('/mark', methods=['POST'])
def mark_attendance():
    data = request.get_json()

    application_id = data.get('application_id')
    status = data.get('status')
    remarks = data.get('remarks')
    marked_by = data.get('marked_by')

    application = Application.query.get(application_id)
    if not application:
        return jsonify({"error": "Application not found"}), 404

    attendance = Attendance.query.filter_by(application_id=application_id).first()

    if not attendance:
        attendance = Attendance(
            application_id=application_id,
            volunteer_id=application.volunteer_id,
            event_id=application.event_id,
            status=AttendanceStatus[status],
            remarks=remarks,
            marked_by=marked_by,
            marked_at=datetime.utcnow()
        )
        db.session.add(attendance)
    else:
        attendance.status = AttendanceStatus[status]
        attendance.remarks = remarks
        attendance.marked_by = marked_by
        attendance.marked_at = datetime.utcnow()

    db.session.commit()

    # -------------------------------
    # BADGE AUTO ASSIGN LOGIC
    # -------------------------------
    if status.lower() == "present":
        volunteer_id = application.volunteer_id

        # Count present events
        present_count = Attendance.query.filter_by(
            volunteer_id=volunteer_id,
            status=AttendanceStatus.present
        ).count()

        # Get eligible badges
        eligible_badges = Badge.query.filter(
            Badge.criteria_events <= present_count
        ).all()

        for badge in eligible_badges:
            # Check if already assigned
            existing = VolunteerBadge.query.filter_by(
                volunteer_id=volunteer_id,
                badge_id=badge.badge_id
            ).first()

            if not existing:
                new_badge = VolunteerBadge(
                    volunteer_id=volunteer_id,
                    badge_id=badge.badge_id
                )
                db.session.add(new_badge)

        db.session.commit()

    return jsonify({"message": "Attendance marked successfully"})


# -------------------------------
# GET EVENT ATTENDANCE
# -------------------------------
@attendance_bp.route('/event/<int:event_id>', methods=['GET'])
def get_event_attendance(event_id):
    records = Attendance.query.filter_by(event_id=event_id).all()
    result = []
    for r in records:
        result.append({
            "attendance_id": r.attendance_id,
            "application_id": r.application_id,
            "volunteer_id": r.volunteer_id,
            "status": r.status.value,
            "remarks": r.remarks,
            "marked_by": r.marked_by,
            "marked_at": r.marked_at
        })
    return jsonify(result)


# -------------------------------
# GET VOLUNTEER ATTENDANCE
# -------------------------------
@attendance_bp.route('/volunteer/<int:volunteer_id>', methods=['GET'])
def get_volunteer_attendance(volunteer_id):
    records = Attendance.query.filter_by(volunteer_id=volunteer_id).all()
    result = []
    for r in records:
        result.append({
            "event_id": r.event_id,
            "status": r.status.value,
            "remarks": r.remarks,
            "marked_at": r.marked_at
        })
    return jsonify(result)