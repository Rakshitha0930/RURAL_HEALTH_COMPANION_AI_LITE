from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, health_records, ai_chat

api_router = APIRouter()

api_router.include_router(auth.router,           prefix="/auth",           tags=["Authentication"])
api_router.include_router(users.router,          prefix="/users",          tags=["Users"])
api_router.include_router(health_records.router, prefix="/health-records", tags=["Health Records"])
api_router.include_router(ai_chat.router,        prefix="/ai",             tags=["AI Chat"])
