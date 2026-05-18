from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import UserUpdate
from app.services.user_service import UserService

router = APIRouter()


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get the currently authenticated user's profile."""
    return {k: v for k, v in current_user.items() if k != "hashed_password"}


@router.put("/me")
async def update_me(
    update_data: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """Update the currently authenticated user's profile."""
    service = UserService(db)
    updated = await service.update(current_user["id"], update_data)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    return {k: v for k, v in updated.items() if k != "hashed_password"}
