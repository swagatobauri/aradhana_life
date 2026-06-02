# pyrefly: ignore [missing-import]
from langchain_core.messages import SystemMessage
# pyrefly: ignore [missing-import]
from langchain_groq import ChatGroq
from backend.graph.state import AgentState
from backend.tools.geocode_place import geocode_place
from backend.tools.compute_birth_chart import compute_birth_chart
from backend.tools.get_daily_transits import get_daily_transits
from backend.tools.knowledge_lookup import knowledge_lookup

# Initialize Groq LLM
llm = ChatGroq(model_name="llama-3.3-70b-versatile", temperature=0.7)

# Bind tools
tools = [geocode_place, compute_birth_chart, get_daily_transits, knowledge_lookup]
llm_with_tools = llm.bind_tools(tools)

SYSTEM_PROMPT = """You are AstroAgent, a warm, wise, and empathetic AI astrologer built for Aradhana, a daily spiritual companion app.

Your goal is to guide the user on their spiritual and astrological journey. You use real astrological data and deep knowledge to answer their questions.

CRITICAL INSTRUCTIONS:
1. You have access to specialized astrological tools. Use them to gather real planetary data instead of guessing.
2. If calculating a birth chart, you MUST resolve the birthplace into exact GPS coordinates (latitude and longitude) first.
3. Do not hallucinate planetary positions. Rely strictly on tool outputs.
4. Be conversational, empathetic, and uplifting. Avoid overly fatalistic predictions.
"""

def reasoner_node(state: AgentState) -> dict:
    """Invokes the LLM to reason and decide the next step."""
    messages = state.get("messages", [])
    
    # Remove old system messages to avoid duplication
    messages = [m for m in messages if not isinstance(m, SystemMessage)]
    
    # Inject birth details if available
    system_prompt = SYSTEM_PROMPT
    if "birth_details" in state and state["birth_details"]:
        bd = state["birth_details"]
        system_prompt += f"\n\nUSER'S BIRTH DETAILS:\nDate: {bd.get('date')}\nTime: {bd.get('time')}\nPlace: {bd.get('place')}"
    
    messages = [SystemMessage(content=system_prompt)] + messages
        
    step_count = state.get("step_count", 0)
    
    # Call the model
    response = llm_with_tools.invoke(messages)
    
    return {
        "messages": [response],
        "step_count": step_count + 1
    }
