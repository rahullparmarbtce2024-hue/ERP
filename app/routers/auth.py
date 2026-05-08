from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, RegisterRequest
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.config import settings
import random, string

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({**data, "exp": expire}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    # Support login by email, mobile, or enrollment number
    user = db.query(User).filter(
        (User.email == credentials.identifier) |
        (User.mobile == credentials.identifier) |
        (User.enrollment_number == credentials.identifier)
    ).first()

    if not user or not pwd_context.verify(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account deactivated")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    user.last_login = datetime.utcnow()
    db.commit()

    return {"access_token": token, "token_type": "bearer", "role": user.role, "user_id": str(user.id)}

@router.post("/send-otp")
async def send_otp(identifier: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.email == identifier) | (User.mobile == identifier)
    ).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp = ''.join(random.choices(string.digits, k=6))
    user.otp_code = otp
    user.otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
    db.commit()
    # Send via email/SMS service here
    return {"message": "OTP sent successfully"}

@router.post("/verify-otp")
async def verify_otp(identifier: str, otp: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.email == identifier) | (User.mobile == identifier)
    ).first()
    if not user or user.otp_code != otp or user.otp_expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    user.is_verified = True
    user.otp_code = None
    db.commit()
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer"}
