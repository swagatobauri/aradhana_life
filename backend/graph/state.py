"""
AgentState — the central state schema for the AstroAgent LangGraph.

This TypedDict defines every field that flows through the graph.
Fields annotated with `operator.add` are append-only reducers —
each node can return a partial dict and the framework merges
automatically.
"""

from __future__ import annotations

from typing import Annotated, Any, Optional, TypedDict
import operator
# pyrefly: ignore [missing-import]
from langgraph.graph.message import add_messages
# pyrefly: ignore [missing-import]
from langchain_core.messages import BaseMessage


class BirthDetails(TypedDict, total=False):
    """Structured birth data collected from the user."""

    date: str          # ISO date string, e.g. "1990-06-15"
    time: str          # 24-hour time string, e.g. "14:30"
    place: str         # Free-text place name, e.g. "Mumbai, India"
    lat: float         # Resolved latitude
    lng: float         # Resolved longitude
    timezone: str      # IANA timezone, e.g. "Asia/Kolkata"


class AgentState(TypedDict, total=False):
    """
    The state object that every node in the LangGraph reads and writes.

    Reducer semantics
    -----------------
    - ``messages``      : append-only (operator.add) — chat history
    - ``tool_outputs``  : append-only (operator.add) — accumulated tool results
    - All other fields  : last-writer-wins (default)

    Circuit breaker
    ---------------
    ``step_count`` is incremented by each reasoning pass. If it exceeds 6
    the conditional edge forces the graph to END, preventing infinite loops.
    """

    # ── Chat history (append-only) ──────────────────────────────
    messages: Annotated[list[BaseMessage], add_messages]

    # ── User birth data ─────────────────────────────────────────
    birth_details: BirthDetails

    # ── Intent classification ────────────────────────────────────
    # One of: "chart_request" | "daily_horoscope" | "free_form" | "off_topic"
    intent: str

    # ── Tool tracking ────────────────────────────────────────────
    tool_outputs: Annotated[list[Any], operator.add]
    current_tool: str

    # ── Safety / control ─────────────────────────────────────────
    step_count: int              # Circuit breaker — max 6 steps
    session_id: str              # Unique session identifier
    error: Optional[str]         # Propagated error message, if any
