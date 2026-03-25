import os
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.chat import get_chat_response

app = FastAPI(title="The Leadership Equation — Developmental Copilot")

app.mount("/static", StaticFiles(directory="static"), name="static")


class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    conversation_id: str


@app.get("/", response_class=HTMLResponse)
async def index():
    return FileResponse("templates/index.html")


@app.post("/api/chat")
async def chat(message: ChatMessage):
    try:
        response, conversation_id = await get_chat_response(
            message.message,
            message.conversation_id,
        )
        return ChatResponse(response=response, conversation_id=conversation_id)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e), "type": type(e).__name__}
        )


@app.get("/health")
async def health():
    return {"status": "ok"}
