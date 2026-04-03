from flask import Blueprint, jsonify
from app.extensions import db
from app.models.attendance_model import Attendance, AttendanceStatus
from app.models.volunteer_model import Volunteer
from app.models.event_model import Event
from sqlalchemy import func

dashboard_attendance_bp = Blueprint('dashboard_attendance', __name__)

@dashboard_attendance_bp.route('/stats', methods=['GET'])
def get_dashboard_stats():

    # Total volunteers
    total_volunteers = Volunteer.query.count()

    # Total events
    total_events = Event.query.count()

    # Total present attendance
    total_attendance = Attendance.query.filter_by(
        status=AttendanceStatus.present
    ).count()

    # Top 5 volunteers by present count
    top_volunteers = (
        db.session.query(
            Volunteer.volunteer_id,
            Volunteer.name,
            func.count(Attendance.attendance_id).label('present_count')
        )
        .join(Attendance, Attendance.volunteer_id == Volunteer.volunteer_id)
        .filter(Attendance.status == AttendanceStatus.present)
        .group_by(Volunteer.volunteer_id, Volunteer.name)
        .order_by(func.count(Attendance.attendance_id).desc())
        .limit(5)
        .all()
    )

    # Event status distribution (for donut chart)
    event_status_counts = (
        db.session.query(
            Event.status,
            func.count(Event.event_id).label('count')
        )
        .group_by(Event.status)
        .all()
    )

    # Monthly volunteer participation (for bar chart)
    monthly_participation = (
    db.session.query(
        func.to_char(Attendance.marked_at, 'MM').label('month'),
        func.count(Attendance.attendance_id).label('count')
    )
    .filter(Attendance.status == AttendanceStatus.present)
    .group_by(func.to_char(Attendance.marked_at, 'MM'))
    .order_by('month')
    .all()
    )

    month_names = {
        '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
        '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
        '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
    }

    return jsonify({
        "total_volunteers": total_volunteers,
        "total_events": total_events,
        "total_attendance": total_attendance,
        "top_volunteers": [
            {"volunteer_id": v.volunteer_id, "name": v.name, "present_count": v.present_count}
            for v in top_volunteers
        ],
        "event_status_distribution": [
            {"status": e.status, "count": e.count}
            for e in event_status_counts
        ],
        "monthly_participation": [
            {"month": month_names.get(m.month, m.month), "volunteers": m.count}
            for m in monthly_participation
        ]
    })
@dashboard_attendance_bp.route('/badges', methods=['GET'])
def get_badge_info():
    from app.models.badge_model import Badge
    badges = Badge.query.order_by(Badge.criteria_events.asc()).all()
    return jsonify([
        {
            "badge_name": b.badge_name,
            "description": b.description,
            "criteria_events": b.criteria_events
        }
        for b in badges
    ])