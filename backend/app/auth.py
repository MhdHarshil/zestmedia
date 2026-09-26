import os
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.admin import Admin

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
bearer_scheme = HTTPBearer(auto_error=False)


def _secret_key() -> str:
    secret_key = os.getenv("JWT_SECRET")
    if not secret_key:
        raise RuntimeError("JWT_SECRET environment variable must be configured")
    return secret_key


def create_access_token(admin_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(admin_id), "exp": expire}
    return jwt.encode(payload, _secret_key(), algorithm=ALGORITHM)


def get_current_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Admin:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Valid admin authentication required",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None:
        raise unauthorized

    try:
        payload = jwt.decode(credentials.credentials, _secret_key(), algorithms=[ALGORITHM])
        subject = payload.get("sub")
        if not isinstance(subject, str):
            raise unauthorized
        admin_id = int(subject)
    except (jwt.InvalidTokenError, ValueError, RuntimeError):
        raise unauthorized

    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if admin is None:
        raise unauthorized
    return admin
