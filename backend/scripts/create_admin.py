from getpass import getpass
from pathlib import Path
import sys

# Allow running this utility directly as `python scripts/create_admin.py`.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from argon2 import PasswordHasher
from sqlalchemy.exc import IntegrityError

from app.database import SessionLocal
from app.models.admin import Admin

ph = PasswordHasher()

def main():
    username = input("Enter admin username: ")
    db = SessionLocal()
    
    try:
        if db.query(Admin).filter(Admin.username == username).first():
            print(f"Admin user '{username}' already exists; no changes were made. Run again with a different username to add another admin.")
            return

        password = getpass("Enter admin password: ")
        password_hash = ph.hash(password)
        admin = Admin(
            username=username,
            password_hash=password_hash
        )
        
        db.add(admin)
        db.commit()

        print(f"Admin user '{username}' created successfully.")

    except IntegrityError:
        db.rollback()
        print(f"Admin user '{username}' already exists; no changes were made. Run again with a different username to add another admin.")

    finally:
        db.close()
        
        
if __name__ == "__main__":
    main()
