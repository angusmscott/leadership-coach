import os
from typing import Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

from app.chat import get_chat_response

app = FastAPI(title="Act - Claude Chatbot")

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    conversation_id: str


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


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


@app.get("/debug")
async def debug():
    api_key = os.environ.get("ANTHROPIC_API_KEY", "NOT SET")
    return {
        "api_key_set": api_key != "NOT SET",
        "api_key_preview": api_key[:20] + "..." if api_key != "NOT SET" else "NOT SET"
    }
