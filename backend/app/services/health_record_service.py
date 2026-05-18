from bson import ObjectId
from datetime import datetime
from typing import List, Optional

from app.models.health_record import HealthRecordCreate


class HealthRecordService:
    def __init__(self, db):
        self.collection = db.health_records

    def _serialize(self, doc: dict) -> dict:
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def get_by_user(self, user_id: str) -> List[dict]:
        cursor = self.collection.find({"user_id": user_id}).sort("date", -1)
        records = []
        async for doc in cursor:
            records.append(self._serialize(doc))
        return records

    async def create(self, user_id: str, record_data: HealthRecordCreate) -> dict:
        doc = {
            **record_data.model_dump(),
            "user_id": user_id,
            "created_at": datetime.utcnow(),
        }
        result = await self.collection.insert_one(doc)
        doc["_id"] = str(result.inserted_id)
        return doc

    async def delete(self, record_id: str, user_id: str) -> bool:
        result = await self.collection.delete_one(
            {"_id": ObjectId(record_id), "user_id": user_id}
        )
        return result.deleted_count > 0
