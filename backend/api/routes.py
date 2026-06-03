import json
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Request
# pyrefly: ignore [missing-import]
from fastapi.responses import StreamingResponse
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import Optional, Dict, Any
# pyrefly: ignore [missing-import]
from langchain_core.messages import HumanMessage, AIMessageChunk
from backend.graph.graph import app as graph_app
from backend.api.limiter import limiter

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
                # Robustly filter: only stream chunks from the reasoner model
                if "reasoner_llm" not in event.get("tags", []):
                    continue
                    
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
                tool_output = event["data"].get("output", "")
                payload = {"type": "tool_end", "tool": tool_name, "output": str(tool_output)}
                yield f"data: {json.dumps(payload)}\n\n"
                
    except Exception as e:
        yield f"data: {json.dumps({'type': 'error', 'content': str(e)})}\n\n"

@router.post("/chat")
@limiter.limit("15/minute")
async def chat_endpoint(request: Request, payload: ChatRequest):
    return StreamingResponse(event_generator(payload), media_type="text/event-stream")

@router.get("/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    config = {"configurable": {"thread_id": session_id}}
    try:
        state = await graph_app.aget_state(config)
        if not state or not state.values:
            return {"messages": []}
            
        messages = state.values.get("messages", [])
        formatted_messages = []
        for msg in messages:
            if isinstance(msg, HumanMessage):
                formatted_messages.append({"id": msg.id or str(hash(msg.content)), "role": "user", "content": msg.content})
            elif msg.type == "ai" and msg.content:
                # We only want to show actual AI responses to the user, not tool calls unless needed
                formatted_messages.append({"id": msg.id or str(hash(msg.content)), "role": "ai", "content": msg.content})
                
        return {"messages": formatted_messages}
    except Exception as e:
        print(f"Error fetching history: {e}")
        return {"messages": []}

from backend.db.database import get_database

class ProfileRequest(BaseModel):
    user_id: str
    birth_details: Dict[str, Any]

@router.get("/profile/{user_id}")
async def get_profile(user_id: str):
    db = get_database()
    if db is None:
        return {"error": "Database not connected"}
    
    profile = await db.profiles.find_one({"user_id": user_id})
    if profile:
        profile.pop("_id", None) # Remove mongo internal id
        return {"profile": profile}
    return {"profile": None}

@router.post("/profile")
async def save_profile(request: ProfileRequest):
    db = get_database()
    if db is None:
        return {"error": "Database not connected"}
        
    await db.profiles.update_one(
        {"user_id": request.user_id},
        {"$set": {"birth_details": request.birth_details}},
        upsert=True
    )
    return {"status": "success"}
