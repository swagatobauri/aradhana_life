import json
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
from langchain_core.messages import HumanMessage, AIMessageChunk
from backend.graph.graph import app as graph_app

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    session_id: str
    birth_details: Optional[Dict[str, Any]] = None

async def event_generator(request: ChatRequest):
    inputs = {
        "messages": [HumanMessage(content=request.message)]
    }
    if request.birth_details:
        inputs["birth_details"] = request.birth_details
        
    config = {"configurable": {"thread_id": request.session_id}}
    
    try:
        async for event in graph_app.astream_events(inputs, config=config, version="v2"):
            kind = event["event"]
            
            if kind == "on_chat_model_stream":
                chunk = event["data"]["chunk"]
                if isinstance(chunk, AIMessageChunk) and chunk.content:
                    payload = {"type": "content", "content": chunk.content}
                    yield f"data: {json.dumps(payload)}\n\n"
                    
            elif kind == "on_tool_start":
                tool_name = event["name"]
                payload = {"type": "tool_start", "tool": tool_name}
                yield f"data: {json.dumps(payload)}\n\n"
                
            elif kind == "on_tool_end":
                tool_name = event["name"]
                payload = {"type": "tool_end", "tool": tool_name}
                yield f"data: {json.dumps(payload)}\n\n"
                
    except Exception as e:
        yield f"data: {json.dumps({'type': 'error', 'content': str(e)})}\n\n"

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    return StreamingResponse(event_generator(request), media_type="text/event-stream")
