from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.models.user import UserCreate, UserResponse
from app.services.user_service import UserService

router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db=Depends(get_db)):
    """Register a new user."""
    service = UserService(db)

    existing = await service.get_by_email(user_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    user = await service.create(user_data)
    token = create_access_token({"sub": user["id"]})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": _safe_user(user),
    }


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
    """Login with email and password (OAuth2 form)."""
    service = UserService(db)
    user = await service.get_by_email(form_data.username)

    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.get("is_active"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled.",
        )

    token = create_access_token({"sub": user["id"]})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": _safe_user(user),
    }


def _safe_user(user: dict) -> dict:
    """Strip sensitive fields before returning to client."""
    return {k: v for k, v in user.items() if k not in ("hashed_password",)}
