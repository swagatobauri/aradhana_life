# pyrefly: ignore [missing-import]
from langgraph.graph import StateGraph, START, END
from backend.graph.state import AgentState
from backend.graph.nodes.reasoner import reasoner_node
from backend.graph.nodes.router import router_node
from backend.graph.nodes.tool_node import tool_node

def create_graph():
    """Compiles and returns the LangGraph state machine."""
    workflow = StateGraph(AgentState)
    
    # 1. Add Nodes
    workflow.add_node("reasoner", reasoner_node)
    workflow.add_node("tools", tool_node)
    
    # 2. Add Edges
    # Start goes straight to the reasoner
    workflow.add_edge(START, "reasoner")
    
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
    
    # Compile the graph
    app = workflow.compile()
    
    return app

# Expose compiled app as module-level variable for easy import
app = create_graph()
