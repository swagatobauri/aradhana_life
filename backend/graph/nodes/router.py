from typing import Literal
from backend.graph.state import AgentState
# pyrefly: ignore [missing-import]
from langchain_core.messages import AIMessage

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
