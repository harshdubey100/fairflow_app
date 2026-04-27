"""
FairFlow LangGraph Agent
Uses Qwen/Qwen2.5-72B-Instruct via huggingface_hub InferenceClient directly.
No OpenAI SDK — pure HF.
"""

import json
import os
import re
from typing import Annotated, TypedDict, Literal

from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage

from huggingface_hub import InferenceClient
from tools import TOOL_REGISTRY, TOOL_DESCRIPTIONS

# ─────────────────────────────────────────────
# HF client — Qwen2.5-72B via HF Inference Providers
# token= is the correct param name for huggingface_hub InferenceClient
# ─────────────────────────────────────────────

HF_TOKEN = os.getenv("HF_TOKEN")
MODEL_ID = "Qwen/Qwen2.5-72B-Instruct"

_hf_client = InferenceClient(
    provider="nebius",  # Nebius hosts Qwen2.5-72B on HF free tier
    token=HF_TOKEN,
)

# ─────────────────────────────────────────────
# System prompt — built as a plain string, no .format()
# {user_role} is substituted at call time via str.replace()
# ─────────────────────────────────────────────

SYSTEM_PROMPT_TEMPLATE = (
    "You are FairFlow Assistant, an AI agent embedded in the FairFlow ticket management system.\n"
    "You help users query tickets, check performance stats, and manage their work.\n\n"
    + TOOL_DESCRIPTIONS
    + """
## How to call a tool
When you need live data, output ONLY a raw JSON object on its own line — no markdown fences, no explanation:
{"tool": "get_tickets", "args": {"status": "OPEN"}}

After you receive the tool result, respond in plain, friendly language.

## Rules
- Never invent ticket IDs or user IDs. Always fetch them first.
- Employees can only see their own assigned tickets — respect that.
- Keep answers concise. Use bullet points for lists.
- If a tool call fails, explain the error and suggest what the user can do.
- If the user asks something unrelated to FairFlow, politely redirect them.
- Current user role: {user_role}
"""
)


# ─────────────────────────────────────────────
# LangGraph state
# ─────────────────────────────────────────────

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    token: str        # Clerk JWT forwarded for tool calls
    user_role: str    # EMPLOYEE | HR | ADMIN
    iterations: int   # loop guard


# ─────────────────────────────────────────────
# LLM call via huggingface_hub InferenceClient
# ─────────────────────────────────────────────

def call_llm(messages: list, user_role: str) -> str:
    """
    Call Qwen2.5-72B-Instruct via HF InferenceClient.chat_completion().
    Converts LangChain message objects → HF chat message dicts.
    """
    system_content = SYSTEM_PROMPT_TEMPLATE.replace("{user_role}", user_role)

    hf_messages = [{"role": "system", "content": system_content}]

    for msg in messages:
        if isinstance(msg, HumanMessage):
            hf_messages.append({"role": "user", "content": msg.content})
        elif isinstance(msg, AIMessage):
            hf_messages.append({"role": "assistant", "content": msg.content})
        elif isinstance(msg, ToolMessage):
            # Inject tool results as a user turn so the model sees them
            hf_messages.append({
                "role": "user",
                "content": f"[Tool result for '{msg.tool_call_id}']\n{msg.content}",
            })

    response = _hf_client.chat_completion(
        model=MODEL_ID,
        messages=hf_messages,
        max_tokens=600,
        temperature=0.1,
    )

    return response.choices[0].message.content.strip()


# ─────────────────────────────────────────────
# Tool call parser
# ─────────────────────────────────────────────

def _parse_tool_call(text: str) -> dict | None:
    """Extract a tool-call JSON from the model response."""
    # 1. Fenced code block  ```json { ... } ```
    m = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if m:
        try:
            return json.loads(m.group(1))
        except json.JSONDecodeError:
            pass

    # 2. First {...} that contains "tool"
    m = re.search(r'\{\s*"tool"\s*:.*?\}', text, re.DOTALL)
    if m:
        try:
            return json.loads(m.group())
        except json.JSONDecodeError:
            pass

    # 3. Whole text is JSON
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict) and "tool" in parsed:
            return parsed
    except json.JSONDecodeError:
        pass

    return None


# ─────────────────────────────────────────────
# Graph nodes
# ─────────────────────────────────────────────

def llm_node(state: AgentState) -> dict:
    text = call_llm(state["messages"], state["user_role"])
    return {
        "messages": [AIMessage(content=text)],
        "iterations": state["iterations"] + 1,
    }


def tool_node(state: AgentState) -> dict:
    last_ai: AIMessage = state["messages"][-1]
    tool_call = _parse_tool_call(last_ai.content)

    if not tool_call:
        return {"messages": []}

    tool_name = tool_call.get("tool", "")
    args = tool_call.get("args", {})

    if tool_name not in TOOL_REGISTRY:
        result = f"Error: unknown tool '{tool_name}'. Available: {list(TOOL_REGISTRY.keys())}"
    else:
        try:
            result = TOOL_REGISTRY[tool_name](token=state["token"], **args)
            result = json.dumps(result, default=str)
        except Exception as exc:
            result = f"Tool error ({tool_name}): {exc}"

    return {
        "messages": [ToolMessage(content=result, tool_call_id=tool_name)],
    }


# ─────────────────────────────────────────────
# Routing
# ─────────────────────────────────────────────

def should_continue(state: AgentState) -> Literal["tool", "end"]:
    if state["iterations"] >= 5:
        return "end"

    last = state["messages"][-1]
    if not isinstance(last, AIMessage):
        return "end"

    tool_call = _parse_tool_call(last.content)
    if tool_call and tool_call.get("tool") in TOOL_REGISTRY:
        return "tool"

    return "end"


# ─────────────────────────────────────────────
# Graph construction (singleton)
# ─────────────────────────────────────────────

def _build_graph():
    g = StateGraph(AgentState)
    g.add_node("llm", llm_node)
    g.add_node("tool", tool_node)
    g.set_entry_point("llm")
    g.add_conditional_edges("llm", should_continue, {"tool": "tool", "end": END})
    g.add_edge("tool", "llm")
    return g.compile()


_graph = None


def _get_graph():
    global _graph
    if _graph is None:
        _graph = _build_graph()
    return _graph


# ─────────────────────────────────────────────
# Public entry point
# ─────────────────────────────────────────────

def run_agent(
    user_message: str,
    token: str,
    user_role: str,
    history: list[dict] | None = None,
) -> str:
    """
    Run one conversational turn through the agent.

    Args:
        user_message: The user's latest message.
        token:        Clerk JWT (forwarded to tool calls).
        user_role:    EMPLOYEE | HR | ADMIN
        history:      Prior turns as [{"role": "user"|"assistant", "content": str}]

    Returns:
        The agent's final plain-text reply.
    """
    graph = _get_graph()

    messages: list = []
    for h in history or []:
        if h["role"] == "user":
            messages.append(HumanMessage(content=h["content"]))
        elif h["role"] == "assistant":
            messages.append(AIMessage(content=h["content"]))

    messages.append(HumanMessage(content=user_message))

    final = graph.invoke({
        "messages": messages,
        "token": token,
        "user_role": user_role,
        "iterations": 0,
    })

    # Return the last AIMessage that isn't a bare tool-call JSON
    for msg in reversed(final["messages"]):
        if isinstance(msg, AIMessage):
            content = msg.content.strip()
            if _parse_tool_call(content) is None:
                return content

    return "I couldn't generate a response. Please try again."
