from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.health_record import HealthRecordCreate
from app.services.health_record_service import HealthRecordService

router = APIRouter()


@router.get("")
async def list_records(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """List all health records for the current user."""
    service = HealthRecordService(db)
    records = await service.get_by_user(current_user["id"])
    return {"records": records, "total": len(records)}


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_record(
    record_data: HealthRecordCreate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """Create a new health record."""
    service = HealthRecordService(db)
    record = await service.create(current_user["id"], record_data)
    return record


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_record(
    record_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """Delete a health record owned by the current user."""
    service = HealthRecordService(db)
    deleted = await service.delete(record_id, current_user["id"])
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Record not found or you don't have permission to delete it.",
        )
