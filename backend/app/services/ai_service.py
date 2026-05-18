"""
Gemini AI service for health-related chat.
"""
import google.generativeai as genai
from typing import List

from app.core.config import settings
from app.models.ai_chat import ChatMessage

SYSTEM_PROMPT = """You are a compassionate and knowledgeable Rural Health Companion AI assistant.
Your role is to:
1. Provide general health information and education to rural community members.
2. Help users understand symptoms and when to seek medical care.
3. Offer guidance on preventive healthcare, nutrition, and wellness.
4. Explain medical terms in simple, accessible language.
5. Always recommend consulting a qualified healthcare professional for diagnosis and treatment.

Important guidelines:
- Never provide specific diagnoses or prescribe medications.
- Always emphasize the importance of professional medical care.
- Be sensitive to limited healthcare access in rural areas.
- Provide practical, actionable advice when possible.
- If a situation sounds like a medical emergency, immediately advise calling emergency services.
"""


class AIService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=SYSTEM_PROMPT,
            )
        else:
            self.model = None

    async def chat(self, message: str, history: List[ChatMessage]) -> str:
        if not self.model:
            return (
                "AI service is not configured. Please add a GEMINI_API_KEY to the backend .env file."
            )

        # Build Gemini history format
        gemini_history = []
        for msg in history:
            gemini_history.append({
                "role": "user" if msg.role == "user" else "model",
                "parts": [msg.content],
            })

        chat_session = self.model.start_chat(history=gemini_history)
        response = await chat_session.send_message_async(message)
        return response.text


# Singleton instance
ai_service = AIService()
