from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.models.ai_chat import ChatRequest, ChatResponse
from app.services.ai_service import ai_service

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user),
):
    """Send a message to the AI health assistant."""
    response_text = await ai_service.chat(request.message, request.history or [])
    return ChatResponse(response=response_text)
