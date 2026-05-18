from bson import ObjectId
from typing import Optional

from app.models.user import UserCreate, UserUpdate
from app.core.security import hash_password


class UserService:
    def __init__(self, db):
        self.collection = db.users

    def _serialize(self, doc: dict) -> dict:
        if doc:
            doc["id"] = str(doc.pop("_id"))
        return doc

    async def get_by_email(self, email: str) -> Optional[dict]:
        doc = await self.collection.find_one({"email": email.lower()})
        return self._serialize(doc) if doc else None

    async def get_by_id(self, user_id: str) -> Optional[dict]:
        try:
            doc = await self.collection.find_one({"_id": ObjectId(user_id)})
            return self._serialize(doc) if doc else None
        except Exception:
            return None

    async def create(self, user_data: UserCreate) -> dict:
        from datetime import datetime

        doc = {
            "full_name": user_data.full_name,
            "email": user_data.email.lower(),
            "phone": user_data.phone,
            "hashed_password": hash_password(user_data.password),
            "date_of_birth": None,
            "blood_group": None,
            "allergies": None,
            "emergency_contact": None,
            "is_active": True,
            "created_at": datetime.utcnow(),
        }
        result = await self.collection.insert_one(doc)
        doc["id"] = str(result.inserted_id)
        doc.pop("_id", None)
        return doc

    async def update(self, user_id: str, update_data: UserUpdate) -> Optional[dict]:
        updates = {k: v for k, v in update_data.model_dump().items() if v is not None}
        if not updates:
            return await self.get_by_id(user_id)

        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": updates},
        )
        return await self.get_by_id(user_id)
