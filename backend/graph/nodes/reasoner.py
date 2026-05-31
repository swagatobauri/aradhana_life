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
1. ALWAYS use the provided tools to gather data before making astrological claims.
   - If they ask about their birth chart, you MUST use `geocode_place` to get their coordinates, then `compute_birth_chart`.
   - If they ask about today's transits or current energy, use `get_daily_transits`.
   - If you need to explain what a planet, house, or aspect means, use `knowledge_lookup`.
2. Do not hallucinate planetary positions. Rely strictly on tool outputs.
3. Be conversational, empathetic, and uplifting. Avoid overly fatalistic predictions.
4. If the user hasn't provided their birth details (date, time, place), ask for them nicely before generating a chart.
"""

def reasoner_node(state: AgentState) -> dict:
    """Invokes the LLM to reason and decide the next step."""
    messages = state.get("messages", [])
    
    # Prepend system prompt if not present
    if not any(isinstance(m, SystemMessage) for m in messages):
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages
        
    step_count = state.get("step_count", 0)
    
    # Call the model
    response = llm_with_tools.invoke(messages)
    
    return {
        "messages": [response],
        "step_count": step_count + 1
    }
