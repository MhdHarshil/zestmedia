from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from app.database import get_db
from app.models.admin import Admin
from app.schemas.auth import LoginRequest

from app.auth import create_access_token

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

ph = PasswordHasher()

@router.post("/login")
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    admin = (
        db.query(Admin)
        .filter(Admin.username == login_data.username)
        .first()
    )
    
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    try:
        ph.verify(
            admin.password_hash,
            login_data.password
        )
    except VerifyMismatchError:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    access_token = create_access_token(admin.id)
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }