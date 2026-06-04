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
    
    # 5. Use MongoDB checkpointer for persistent chat history
    # pyrefly: ignore [missing-import]
    from motor.motor_asyncio import AsyncIOMotorClient
    # pyrefly: ignore [missing-import]
    from langgraph.checkpoint.mongodb.aio import AsyncMongoDBSaver
    import os
    
    mongo_url = os.getenv("MONGODB_URI")
    memory = None
    if mongo_url:
        client = AsyncIOMotorClient(mongo_url)
        memory = AsyncMongoDBSaver(client, db_name="aradhana")
    else:
        memory = MemorySaver()
        print("Warning: MONGODB_URI not set. Using in-memory checkpointer.")
        
    # Compile the graph
    app = workflow.compile(checkpointer=memory)
    
    return app


_graph_app = None

def get_graph():
    """Returns the compiled graph, creating it lazily on first call."""
    global _graph_app
    if _graph_app is None:
        _graph_app = create_graph()
    return _graph_app

