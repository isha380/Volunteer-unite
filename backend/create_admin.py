from app import create_app, db
from app.models.admin_model import Admin  # Import Admin model, not User
from werkzeug.security import generate_password_hash
from datetime import datetime

app = create_app()

with app.app_context():
    # Check if admin already exists
    admin = Admin.query.filter_by(email='admin@volunteerunite.com').first()
    
    if admin:
        print("✓ Admin user already exists!")
        print(f"Email: {admin.email}")
        print(f"Name: {admin.name}")
    else:
        # Create admin user - matching your Admin model fields
        admin = Admin(
            name='System Administrator',  # Changed from 'username' to 'name'
            email='admin@volunteerunite.com',
            phone='9876543210',  # Add phone number (required in your model)
            password_hash=generate_password_hash('Admin@123'),  # Changed from 'password' to 'password_hash'
            role='admin',
            created_at=datetime.utcnow()
        )
        
        db.session.add(admin)
        db.session.commit()
        
        print("✓ Admin user created successfully!")
        print("=" * 50)
        print("Admin Credentials:")
        print("Email: admin@volunteerunite.com")
        print("Password: Admin@123")
        print("Phone: 9876543210")
        print("=" * 50)
        print("  IMPORTANT: Change this password after first login!")