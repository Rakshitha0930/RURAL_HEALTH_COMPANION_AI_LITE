from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class HealthRecordCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    record_type: str = Field(..., description="Consultation, Lab Result, Prescription, etc.")
    date: str = Field(..., description="ISO date string YYYY-MM-DD")
    description: Optional[str] = None
    doctor_name: Optional[str] = None
    facility: Optional[str] = None


class HealthRecordResponse(HealthRecordCreate):
    id: str = Field(alias="_id")
    user_id: str
    created_at: datetime

    class Config:
        populate_by_name = True


class HealthRecordsListResponse(BaseModel):
    records: list[HealthRecordResponse]
    total: int
