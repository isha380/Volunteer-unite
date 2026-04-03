# from app.db import get_db_connection

# def check_and_assign_badges(volunteer_id):
#     conn = get_db_connection()
#     cur = conn.cursor()

#     # Count present attendance
#     cur.execute("""
#         SELECT COUNT(*) FROM attendance
#         WHERE volunteer_id = %s AND status = 'present'
#     """, (volunteer_id,))
    
#     present_count = cur.fetchone()[0]

#     # Get eligible badges
#     cur.execute("""
#         SELECT badge_id FROM badges
#         WHERE criteria_events <= %s
#     """, (present_count,))
    
#     eligible_badges = cur.fetchall()

#     # Assign badge if not already assigned
#     for badge in eligible_badges:
#         badge_id = badge[0]
        
#         cur.execute("""
#             INSERT INTO volunteer_badges (volunteer_id, badge_id)
#             VALUES (%s, %s)
#             ON CONFLICT (volunteer_id, badge_id) DO NOTHING
#         """, (volunteer_id, badge_id))

#     conn.commit()
#     cur.close()
#     conn.close()

from app.extensions import db
from app.models import Attendance, Badge, VolunteerBadge

def check_and_assign_badges(volunteer_id):
    # Count present attendance
    present_count = db.session.query(Attendance)\
        .filter_by(volunteer_id=volunteer_id, status='present')\
        .count()

    # Get eligible badges
    eligible_badges = db.session.query(Badge)\
        .filter(Badge.criteria_events <= present_count)\
        .all()

    # Assign badge if not already assigned
    for badge in eligible_badges:
        existing = db.session.query(VolunteerBadge)\
            .filter_by(volunteer_id=volunteer_id, badge_id=badge.badge_id)\
            .first()

        if not existing:
            new_badge = VolunteerBadge(
                volunteer_id=volunteer_id,
                badge_id=badge.badge_id
            )
            db.session.add(new_badge)

    db.session.commit()