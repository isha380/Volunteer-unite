
# from app.models.volunteer_model import Volunteer
# from app.models.event_model import Event
# from app.models.event_volunteer_match_model import EventVolunteerMatch
# from app.models.application_model import Application
# from app import db
# from datetime import datetime
# from app.models.attendance_model import Attendance

# # -------------------------
# # Utilities
# # -------------------------
# def extract_keywords(text):
#     if not text:
#         return []
#     return [word.strip().lower() for word in text.split(',') if word.strip()]


# def normalize_availability(availability_str):
#     if not availability_str:
#         return None

#     val = availability_str.strip().lower()

#     if val in ("weekdays", "weekday"):
#         return "weekdays"

#     if val in ("weekends", "weekend"):
#         return "weekends"

#     return val


# def is_available_on(availability_str, weekday_number):
#     normalized = normalize_availability(availability_str)

#     # Saturday = 5 in your system
#     if normalized == "weekdays":
#         return weekday_number != 5

#     if normalized == "weekends":
#         return weekday_number == 5

#     return False


# # -------------------------
# # Match Score Computation
# # -------------------------
# def compute_match_score(volunteer: Volunteer, event: Event):

#     # ----- KEYWORD MATCH -----
#     volunteer_keywords = extract_keywords(volunteer.skills) + extract_keywords(volunteer.interests)
#     event_keywords = extract_keywords(event.required_skills) + extract_keywords(event.description)

#     keyword_score = sum(1 for kw in event_keywords if kw in volunteer_keywords)

#     # ----- AVAILABILITY BONUS (ONLY BONUS, NEVER PENALTY) -----
#     availability_bonus = 0

#     if volunteer.availability:
#         event_weekday = event.event_date.weekday()

#         if is_available_on(volunteer.availability, event_weekday):
#             availability_bonus = 1


#     # ----- APPLIED BONUS (+10) -----
#     application = Application.query.filter_by(
#         volunteer_id=volunteer.volunteer_id,
#         event_id=event.event_id
#     ).first()

#     applied_bonus = 10 if application else 0


#     # ----- FINAL SCORE -----
#     match_score = keyword_score + availability_bonus + applied_bonus


#     # ----- SAVE TO DB -----
#     existing = EventVolunteerMatch.query.filter_by(
#         volunteer_id=volunteer.volunteer_id,
#         event_id=event.event_id
#     ).first()

#     if existing:
#         existing.keyword_score = keyword_score
#         existing.availability_bonus = availability_bonus
#         existing.match_score = match_score
#         existing.created_at = datetime.utcnow()

#     else:
#         new_match = EventVolunteerMatch(
#             volunteer_id=volunteer.volunteer_id,
#             event_id=event.event_id,
#             keyword_score=keyword_score,
#             availability_bonus=availability_bonus,
#             match_score=match_score
#         )
#         db.session.add(new_match)

#     db.session.commit()

#     return match_score


# def compute_all_matches():
#     volunteers = Volunteer.query.all()
#     events = Event.query.all()

#     for event in events:
#         for volunteer in volunteers:
#             compute_match_score(volunteer, event)

#     print("All match scores computed and stored in EventVolunteerMatch.")


# # -------------------------
# # Ranking and Recommendation
# # -------------------------
# def get_applied_ranking(event_id):

#     applied_ids = Application.query.filter_by(event_id=event_id)\
#                     .with_entities(Application.volunteer_id)

#     results = EventVolunteerMatch.query\
#         .filter(
#             EventVolunteerMatch.event_id == event_id,
#             EventVolunteerMatch.volunteer_id.in_(applied_ids)
#         )\
#         .order_by(EventVolunteerMatch.match_score.desc())\
#         .all()

#     return results


# def get_recommended(event_id):

#     results = EventVolunteerMatch.query\
#         .filter_by(event_id=event_id)\
#         .order_by(EventVolunteerMatch.match_score.desc())\
#         .all()

#     return results


# # -------------------------
# # Greedy Assignment – SOFT PRIORITY
# # -------------------------
# def greedy_assign(event_id):

#     event = Event.query.get(event_id)

#     if not event:
#         return {"error": "Event not found"}

#     max_slots = event.max_volunteers

#     approved_count = Application.query.filter_by(
#         event_id=event_id,
#         status='Approved'
#     ).count()

#     available_slots = max_slots - approved_count

#     if available_slots <= 0:
#         return {
#             "message": "No slots available",
#             "max_slots": max_slots,
#             "already_approved": approved_count
#         }


#     # Rank ONLY by score – no hard filtering
#     all_matches = EventVolunteerMatch.query\
#         .filter_by(event_id=event_id)\
#         .order_by(EventVolunteerMatch.match_score.desc())\
#         .all()


#     shortlisted = []

#     for match in all_matches:

#         if len(shortlisted) >= available_slots:
#             break


#         app = Application.query.filter_by(
#             volunteer_id=match.volunteer_id,
#             event_id=event_id
#         ).first()


#         if app:
#             app.is_shortlisted = True
#             shortlisted.append(match.volunteer_id)

#         else:
#             new_app = Application(
#                 volunteer_id=match.volunteer_id,
#                 event_id=event_id,
#                 status="Pending",
#                 is_shortlisted=True
#             )

#             db.session.add(new_app)
#             shortlisted.append(match.volunteer_id)

#          attendance = Attendance(
#          application_id = app.application_id,
#          event_id = event_id,
#          volunteer_id = match.volunteer_id,
#          status = 'pending'
#          )
#          db.session.add(attendance)

#     db.session.commit()

#     return {
#         "event_id": event_id,
#         "max_slots": max_slots,
#         "available_slots": available_slots,
#         "shortlisted_count": len(shortlisted),
#         "shortlisted_volunteers": shortlisted
#     }

from app.models.volunteer_model import Volunteer
from app.models.event_model import Event
from app.models.event_volunteer_match_model import EventVolunteerMatch
from app.models.application_model import Application
from app.models.attendance_model import Attendance
from app import db
from datetime import datetime


# -------------------------
# Utilities
# -------------------------
def extract_keywords(text):
    if not text:
        return []
    return [word.strip().lower() for word in text.split(',') if word.strip()]


def normalize_availability(availability_str):
    if not availability_str:
        return None

    val = availability_str.strip().lower()

    if val in ("weekdays", "weekday"):
        return "weekdays"

    if val in ("weekends", "weekend"):
        return "weekends"

    return val


def is_available_on(availability_str, weekday_number):
    normalized = normalize_availability(availability_str)

    # Saturday = 5
    if normalized == "weekdays":
        return weekday_number != 5

    if normalized == "weekends":
        return weekday_number == 5

    return False


# -------------------------
# Match Score Computation
# -------------------------
def compute_match_score(volunteer: Volunteer, event: Event):

    # Keyword match
    volunteer_keywords = extract_keywords(volunteer.skills) + extract_keywords(volunteer.interests)
    event_keywords = extract_keywords(event.required_skills) + extract_keywords(event.description)

    keyword_score = sum(1 for kw in event_keywords if kw in volunteer_keywords)

    # Availability bonus
    availability_bonus = 0
    if volunteer.availability:
        event_weekday = event.event_date.weekday()
        if is_available_on(volunteer.availability, event_weekday):
            availability_bonus = 1

    # Applied bonus
    application = Application.query.filter_by(
        volunteer_id=volunteer.volunteer_id,
        event_id=event.event_id
    ).first()

    applied_bonus = 10 if application else 0

    # Final score
    match_score = keyword_score + availability_bonus + applied_bonus

    # Save to EventVolunteerMatch table
    existing = EventVolunteerMatch.query.filter_by(
        volunteer_id=volunteer.volunteer_id,
        event_id=event.event_id
    ).first()

    if existing:
        existing.keyword_score = keyword_score
        existing.availability_bonus = availability_bonus
        existing.match_score = match_score
        existing.created_at = datetime.utcnow()
    else:
        new_match = EventVolunteerMatch(
            volunteer_id=volunteer.volunteer_id,
            event_id=event.event_id,
            keyword_score=keyword_score,
            availability_bonus=availability_bonus,
            match_score=match_score
        )
        db.session.add(new_match)

    db.session.commit()
    return match_score


def compute_all_matches():
    volunteers = Volunteer.query.all()
    events = Event.query.all()

    for event in events:
        for volunteer in volunteers:
            compute_match_score(volunteer, event)

    print("All match scores computed and stored.")


# -------------------------
# Ranking
# -------------------------
def get_applied_ranking(event_id):

    applied_ids = Application.query.filter_by(event_id=event_id)\
                    .with_entities(Application.volunteer_id)

    results = EventVolunteerMatch.query\
        .filter(
            EventVolunteerMatch.event_id == event_id,
            EventVolunteerMatch.volunteer_id.in_(applied_ids)
        )\
        .order_by(EventVolunteerMatch.match_score.desc())\
        .all()

    return results


def get_recommended(event_id):

    results = EventVolunteerMatch.query\
        .filter_by(event_id=event_id)\
        .order_by(EventVolunteerMatch.match_score.desc())\
        .all()

    return results


# -------------------------
# Greedy Assignment + Attendance Creation
# -------------------------
def greedy_assign(event_id):

    event = Event.query.get(event_id)

    if not event:
        return {"error": "Event not found"}

    max_slots = event.max_volunteers

    approved_count = Application.query.filter_by(
        event_id=event_id,
        status='Approved'
    ).count()

    available_slots = max_slots - approved_count

    if available_slots <= 0:
        return {
            "message": "No slots available",
            "max_slots": max_slots,
            "already_approved": approved_count
        }

    # Rank by score
    all_matches = EventVolunteerMatch.query\
        .filter_by(event_id=event_id)\
        .order_by(EventVolunteerMatch.match_score.desc())\
        .all()

    shortlisted = []

    for match in all_matches:

        if len(shortlisted) >= available_slots:
            break

        app = Application.query.filter_by(
            volunteer_id=match.volunteer_id,
            event_id=event_id
        ).first()

        # If application exists
        if app:
            app.is_shortlisted = True
            application_id = app.application_id

        # If application does not exist, create one
        else:
            new_app = Application(
                volunteer_id=match.volunteer_id,
                event_id=event_id,
                status="Pending",
                is_shortlisted=True
            )
            db.session.add(new_app)
            db.session.flush()  # To get application_id
            application_id = new_app.application_id

        shortlisted.append(match.volunteer_id)

        # Create attendance record if not exists
        existing_attendance = Attendance.query.filter_by(
            application_id=application_id
        ).first()

        if not existing_attendance:
            attendance = Attendance(
                application_id=application_id,
                event_id=event_id,
                volunteer_id=match.volunteer_id,
                status='pending'
            )
            db.session.add(attendance)

    db.session.commit()

    return {
        "event_id": event_id,
        "max_slots": max_slots,
        "available_slots": available_slots,
        "shortlisted_count": len(shortlisted),
        "shortlisted_volunteers": shortlisted
    }
