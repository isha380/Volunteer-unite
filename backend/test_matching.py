import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app

app = create_app()

with app.app_context():
    from app.services.matching import compute_all_matches, get_recommended
    from app.models.event_model import Event
    from app.models.volunteer_model import Volunteer

    # Show all events
    events = Event.query.all()
    print("=== EVENTS ===")
    for e in events:
        print(f"  ID: {e.event_id} | Title: {e.title} | Slots: {e.max_volunteers}")

    # Show all volunteers
    volunteers = Volunteer.query.all()
    print(f"\n=== VOLUNTEERS ({len(volunteers)} total) ===")
    for v in volunteers:
        print(f"  ID: {v.volunteer_id} | Name: {v.name} | Skills: {v.skills} | Availability: {v.availability}")

    # ← THIS LINE IS THE KEY — recalculate scores with the new logic
    print("\nRecalculating all match scores...")
    compute_all_matches()

    # Now read the fresh scores
    print("\n=== MATCH SCORES ===")
    for e in events:
        print(f"\n--- {e.title} (ID: {e.event_id}, Slots: {e.max_volunteers}) ---")
        results = get_recommended(e.event_id)
        if not results:
            print("  No matches found.")
        for r in results:
            print(f"  Volunteer {r.volunteer_id} → Score: {r.match_score} (keywords: {r.keyword_score}, availability: {r.availability_bonus})")