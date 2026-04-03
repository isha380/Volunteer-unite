from flask import Blueprint, jsonify
from app.extensions import db                              
from app.models.badge_model import Badge, VolunteerBadge  

badge_bp = Blueprint('badges', __name__)

@badge_bp.route('/volunteer/<int:volunteer_id>', methods=['GET'])
def get_volunteer_badges(volunteer_id):
    results = (
        db.session.query(Badge.badge_name, Badge.description, VolunteerBadge.awarded_at)
        .join(VolunteerBadge, VolunteerBadge.badge_id == Badge.badge_id)
        .filter(VolunteerBadge.volunteer_id == volunteer_id)
        .all()
    )

    badge_list = [
        {
            "badge_name": row.badge_name,
            "description": row.description,
            "awarded_at": row.awarded_at
        }
        for row in results
    ]

    return jsonify(badge_list)