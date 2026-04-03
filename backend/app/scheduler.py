from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta

def send_event_reminders():
    from app.models.event_model import Event
    from app.models.application_model import Application
    from app.services.email_services import send_email

    tomorrow = datetime.now().date() + timedelta(days=1)
    
   
    events = Event.query.filter_by(event_date=tomorrow).all()

    for event in events:
        applications = Application.query.filter_by(
            event_id=event.event_id, status='Approved'
        ).all()

        for app in applications:
            volunteer = app.volunteer
            if volunteer:
                send_email(
                    to=volunteer.email,
                    subject="Event Reminder ",
                    body=(
                        f"Hello {volunteer.name},\n\n"
                        f"Reminder: You have '{event.title}' tomorrow!\n"
                        f"Date: {event.event_date}\n"
                        f"Time: {event.event_time}\n"   
                        f"Location: {event.location}\n\n"
                        f"Please be on time.\n\n"
                        f"Volunteer Unite Team"
                    )
                )

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(send_event_reminders, 'interval', hours=24)
    scheduler.start()