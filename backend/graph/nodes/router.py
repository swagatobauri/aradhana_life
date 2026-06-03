import json
from typing import Literal
from backend.graph.state import AgentState
# pyrefly: ignore [missing-import]
from langchain_core.messages import AIMessage, SystemMessage
# pyrefly: ignore [missing-import]
from langchain_groq import ChatGroq

intent_llm = ChatGroq(model_name="llama-3.3-70b-versatile", temperature=0.0).with_config({"tags": ["intent_llm"]})

INTENT_PROMPT = """You are an intent classifier for an astrology app.
Classify the user's latest message into EXACTLY ONE of the following intents:
- chart_request (User is asking about their birth chart, zodiac sign, ascendant, etc.)
- daily_horoscope (User is asking about today's transits, current planetary positions, or their daily reading)
- free_form (User is asking a general astrology question that doesn't fit the above)
- off_topic (User is asking about something completely unrelated to astrology, spirituality, or their life journey. E.g. coding, fixing a car, unrelated trivia).

Return ONLY a valid JSON object with a single key "intent" containing one of the 4 strings above. Do not include markdown formatting or backticks. Example: {"intent": "chart_request"}
"""

def intent_classifier_node(state: AgentState) -> dict:
    """Classifies the user's intent into one of 4 categories."""
    messages = state.get("messages", [])
    if not messages:
        return {"intent": "free_form"}
        
    user_msgs = [m for m in messages if m.type == "human"]
    if not user_msgs:
        return {"intent": "free_form"}
        
    last_user_msg = user_msgs[-1].content
    
    response = intent_llm.invoke([
        SystemMessage(content=INTENT_PROMPT),
        {"role": "user", "content": f"User message: {last_user_msg}"}
    ])
    
    try:
        content = response.content.strip()
        # Clean up any potential markdown formatting
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
            
        data = json.loads(content)
        intent = data.get("intent", "free_form")
        
        # Validate intent
        valid_intents = ["chart_request", "daily_horoscope", "free_form", "off_topic"]
        if intent not in valid_intents:
            intent = "free_form"
            
        return {"intent": intent}
    except Exception:
        return {"intent": "free_form"}


def router_node(state: AgentState) -> Literal["tools", "__end__"]:
    """
    Determines whether to execute tools or end the cycle.
    Returns the name of the next node to execute.
    """
    messages = state.get("messages", [])
    if not messages:
        return "__end__"
        
    last_message = messages[-1]
    
    # Circuit breaker: stop if we've taken too many steps
    if state.get("step_count", 0) >= 6:
        return "__end__"
        
    # If the LLM decided to call a tool, route to the tools node
    if isinstance(last_message, AIMessage) and last_message.tool_calls:
        return "tools"
        
    # Otherwise, the LLM has responded to the user, so we end
    return "__end__"
