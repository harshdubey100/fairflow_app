"""
FairFlow Agent FastAPI Server
Exposes the LangGraph agent as a REST endpoint.
The Express backend proxies /api/agent/chat → this service.
"""

import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from agent import run_agent

app = FastAPI(title="FairFlow Agent", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
# Request / Response models
# ─────────────────────────────────────────────

class HistoryItem(BaseModel):
    role: str       # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    user_role: str = "EMPLOYEE"
    history: list[HistoryItem] = []


class ChatResponse(BaseModel):
    reply: str


# ─────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "service": "fairflow-agent"}


@app.post("/chat", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    authorization: Optional[str] = Header(None),
):
    """
    Chat with the FairFlow agent.
    Requires a valid Clerk JWT in the Authorization header.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = authorization.removeprefix("Bearer ").strip()

    history = [{"role": h.role, "content": h.content} for h in body.history]

    try:
        reply = run_agent(
            user_message=body.message,
            token=token,
            user_role=body.user_role,
            history=history,
        )
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AGENT_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
