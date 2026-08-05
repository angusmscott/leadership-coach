# The Leadership Equation — Developmental Copilot

A reflective AI companion for leaders, branded to ACT Leadership (actleader.com). Users have a structured chat conversation with Claude, which guides awareness-building through the Leadership Equation framework — not coaching, not advice.

## Stack

- **Backend:** FastAPI + Python 3.9+, async throughout
- **AI:** Anthropic SDK (`anthropic.AsyncAnthropic`), models via `MODEL_SONNET`/`MODEL_OPUS` constants in `chat.py` (currently Claude 5 Sonnet/Opus), user-selectable in the UI
- **Frontend:** Vanilla JS, Jinja2 templates, no build step
- **Deployment:** Railway via `Procfile` (`uvicorn app.main:app`), GitHub repo: `angusmscott/leadership-coach`
- **Tests:** pytest + pytest-asyncio, httpx for ASGI transport

## Project structure

```
app/
  main.py     — FastAPI app: GET /, POST /api/chat, GET /health
  chat.py     — Claude integration, in-memory conversation storage, system prompt
static/
  app.js      — Chat UI: message rendering, sidebar variable modals, welcome message
  style.css   — ACT brand palette, dark theme, responsive layout
templates/
  index.html  — Single-page chat UI with equation sidebar
tests/
  test_api.py — Health and index smoke tests
```

## Running locally

```bash
cp .env.example .env   # add ANTHROPIC_API_KEY
pip install -e ".[dev]"
uvicorn app.main:app --reload
```

Tests: `pytest`
Lint/format: `ruff check .` / `ruff format .`

## Key architectural decisions

**Conversation storage** is in-process Python dict keyed by UUID (`conversations` in `chat.py`). No database — conversations are lost on restart. Intentional for MVP; a future version would need persistent storage.

**Dynamic welcome message** is generated via a separate Claude call each session (`generate_welcome_message()`) using `WELCOME_META_PROMPT`, with `WELCOME_MESSAGE` as fallback. The welcome is injected as the first assistant turn before the user sends anything, keeping conversation history consistent.

**Prompt caching** is active on the system prompt (`cache_control: {"type": "ephemeral"}`). The system prompt is large (~700 lines). Do not remove caching.

**System prompt** (`SYSTEM_PROMPT` in `chat.py`) is the core product. It is ~700 lines and encodes the full framework, conversation design, response units, example conversations, and hard constraints. Changes here are high-stakes — read it fully before editing.

**Do not book-reference** the companion. As of the v2 rewrite, it stands alone — no mentions of chapters, reading, or the book. This is intentional and must be preserved.

## The Leadership Equation framework (baked into system prompt)

Five variables forming an infinity loop:
- **i** (Leadership Identity) — the patterned version of the leader that runs automatically under pressure; constructed, not fixed
- **U** (Leadership Presence) — how the leader shows up in real time; Felt U (inside) vs Expressed U (what others experience)
- **x** (Leadership Impact) — what leadership creates in results and relationships; cannot be fully known from inside
- **Spark** — the inner signal of meaning and aliveness; what makes change sustainable beyond habit
- **Context** — the specific power, pace, and norms of the environment the leader is operating in now
- **Lp** (Leadership Performance) — the output of the equation; measured in results and relationships together

**ACT framework:** Awareness → Choice → Transformation (developmental arc; companion primarily supports Awareness)

**Awareness levels:**
- Level 1 — Reactive: pattern runs automatically, no gap, everything feels external
- Level 2 — Reflective: pattern visible in hindsight
- Level 3 — Responsive: pattern visible in real time, gap opens
- **Critical rule:** do not ask a Level 3 question of a Level 1 user

## AI behavioural constraints (non-negotiable)

- British English spelling and phrasing
- One question per response, always — never stacked
- Short lines, white space — especially for mobile
- Meet and Point structure: reflect user's words → check if needed → one question forward
- Never diagnose, score, advise, or interpret beyond what the person shared
- Never say "I'm not a coach" — show the boundary through behaviour
- Never reference the book, chapters, or reading
- One Sarah story anchor per conversation maximum
- Never assume the user's pattern is control just because Sarah's was
- If genuine distress surfaces, name it with care and point elsewhere

## Conversation design (summary)

**Arc:** Meet → Explore → Connect → Close

**Variable entry paths** (follow energy, not a fixed sequence):
- U → i → x (stress/pressure entry)
- x → Context → U → i (feedback entry)
- Context → U → i (new role entry)
- Spark → i → U (flatness/meaning entry)
- i → U → x (pattern entry)

**Response units** exist for all five variables (detailed in system prompt). One unit per conversation — two at most. Each unit: insight + question + optional Sarah anchor. After the question, follow the user.

**Sarah** — primary story anchor across all variables; used as mirror not template, one reference per conversation.

## Roadmap / planned work

**Lead capture registration page** — Mike Hutchins (owner of ACT, this app's business sponsor) wants a registration page in front of the chat to capture leads before he'll promote the tool. Not yet built.

**CRM:** Mike uses **Freshsales** (Freshworks CRM) — freshsales.io. When the registration page is built, leads should be created there via the Freshsales REST API (API key auth, found in Freshsales admin under Settings → API Settings). Freshsales distinguishes Leads from Contacts — confirm with Mike which object type his instance uses before integrating, and whether he wants any custom fields populated (e.g. "how did you hear about us"). Need his API key and domain (e.g. `mikehutchins.freshsales.io`) before implementing.

Notifying ACT of a new lead is a Freshsales-side concern, not ours — Freshsales Workflows (Admin → Automations → Workflows) can trigger email/Slack notifications on record creation. Our app only needs to create the Lead/Contact via the API; Mike configures the notification rule in his own Freshsales admin panel.

## Brand / UI

ACT brand palette: charcoal `#1a1a2e`, navy `#0f3460`, gold `#e8a838`, teal `#2a9d8f`, coral `#e76f51`.
Fonts: Cormorant Garamond (display), DM Sans (body).
Each variable has a distinct colour in the sidebar nav: Context (slate), i (gold), U (teal), x (coral), Spark (purple).
Sidebar variable buttons open info modals with variable definitions (defined in `app.js` `variableInfo`).
