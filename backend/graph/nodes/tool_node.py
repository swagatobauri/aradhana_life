# pyrefly: ignore [missing-import]
from langgraph.prebuilt import ToolNode
from backend.tools.geocode_place import geocode_place
from backend.tools.compute_birth_chart import compute_birth_chart
from backend.tools.get_daily_transits import get_daily_transits
from backend.tools.knowledge_lookup import knowledge_lookup

tools = [geocode_place, compute_birth_chart, get_daily_transits, knowledge_lookup]

# Use LangGraph's prebuilt ToolNode to automatically handle tool execution
tool_node = ToolNode(tools)
