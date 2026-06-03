# pyrefly: ignore [missing-import]
from langgraph.graph import StateGraph, START, END
# pyrefly: ignore [missing-import]
from langgraph.checkpoint.memory import MemorySaver
from backend.graph.state import AgentState
from backend.graph.nodes.reasoner import reasoner_node, off_topic_node
from backend.graph.nodes.router import router_node, intent_classifier_node
from backend.graph.nodes.tool_node import tool_node

def route_intent(state: AgentState) -> str:
    """Routes based on the intent classified by the intent node."""
    intent = state.get("intent", "free_form")
    if intent == "off_topic":
        return "off_topic"
    return "reasoner"

def create_graph():
    """Compiles and returns the LangGraph state machine."""
    workflow = StateGraph(AgentState)
    
    # 1. Add Nodes
    workflow.add_node("intent_classifier", intent_classifier_node)
    workflow.add_node("off_topic", off_topic_node)
    workflow.add_node("reasoner", reasoner_node)
    workflow.add_node("tools", tool_node)
    
    # 2. Add Edges
    # Start goes to intent classifier first
    workflow.add_edge(START, "intent_classifier")
    
    # Intent classifier routes to off_topic or reasoner
    workflow.add_conditional_edges(
        "intent_classifier",
        route_intent,
        {
            "off_topic": "off_topic",
            "reasoner": "reasoner"
        }
    )
    
    # Off-topic node just ends
    workflow.add_edge("off_topic", END)
    
    # Reasoner goes to the conditional router
    workflow.add_conditional_edges(
        "reasoner",
        router_node,
        {
            "tools": "tools",
            "__end__": END
        }
    )
    
    # Tools go back to the reasoner to evaluate output
    workflow.add_edge("tools", "reasoner")
    
    # 5. Add Checkpointer
    # Try to use MongoDB for persistent memory, fallback to MemorySaver
    # pyrefly: ignore [missing-import]
    from langgraph.checkpoint.mongodb import MongoDBSaver
    # pyrefly: ignore [missing-import]
    from pymongo import MongoClient
    import os
    
    mongo_uri = os.getenv("MONGODB_URI")
    if mongo_uri:
        # Initialize motor client for checkpointer
        # Note: langgraph will create a 'checkpoints' database automatically
        client = MongoClient(mongo_uri)
        memory = MongoDBSaver(client)
    else:
        memory = MemorySaver()
    
    # Compile the graph
    app = workflow.compile(checkpointer=memory)
    
    return app

# Expose compiled app as module-level variable for easy import
app = create_graph()
