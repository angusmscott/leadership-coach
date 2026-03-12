# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Run Commands

```bash
# Install dependencies
pip install -e ".[dev]"

# Run development server
uvicorn app.main:app --reload

# Run tests
pytest

# Run a single test
pytest tests/test_api.py::test_health

# Lint code
ruff check .

# Format code
ruff format .
```

## Environment Setup

Copy `.env.example` to `.env` and add your Anthropic API key:
```bash
cp .env.example .env
```

## Architecture

**Backend (FastAPI):**
- `app/main.py` - API routes and app configuration. Serves the chat UI and handles `/api/chat` POST requests.
- `app/chat.py` - Claude integration via `anthropic.AsyncAnthropic()`. Manages conversation history in-memory using conversation IDs.

**Frontend:**
- `templates/index.html` - Jinja2 template for the chat interface
- `static/app.js` - Handles message sending, typing indicators, and conversation state
- `static/style.css` - Chat UI styling

**API:**
- `POST /api/chat` - Send a message and get a response. Accepts `{message: string, conversation_id?: string}`, returns `{response: string, conversation_id: string}`.
- `GET /health` - Health check endpoint

## Key Patterns

- Conversations are tracked by UUID stored client-side; the server maintains message history keyed by this ID
- The Anthropic client is initialized once at module load and reuses the `ANTHROPIC_API_KEY` from environment
- All API handlers are async
