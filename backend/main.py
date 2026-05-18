"""
Rural Health Companion AI Lite – FastAPI entry point.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import connect_db, close_db
from app.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage startup / shutdown events."""
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="Rural Health Companion AI Lite",
    description="Backend API for the Rural Health Companion AI Lite application.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount versioned router
app.include_router(api_router, prefix="/api")


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "Rural Health Companion AI Lite API"}


@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}
