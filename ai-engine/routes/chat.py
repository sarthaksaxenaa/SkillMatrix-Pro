"""
Chatbot route: general-purpose AI conversation.
"""

from fastapi import APIRouter
from models import ChatRequest
from config import groq_client, SELECTED_MODEL

router = APIRouter()


@router.post("/chat")
async def chat(data: ChatRequest):
    """Send a message to the Groq AI and return its reply."""
    try:
        if not groq_client:
            return {"reply": "System Error: No AI client loaded. Check API Key."}

        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": data.message}],
            model=SELECTED_MODEL,
        )
        return {"reply": chat_completion.choices[0].message.content.strip()}
    except Exception as e:
        return {"reply": f"AI Error: {str(e)}"}
