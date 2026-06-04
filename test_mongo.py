import asyncio
import os
os.environ["EVAL_MODE"] = "false"
from backend.main import lifespan
from backend.graph.graph import get_graph
# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from langchain_core.messages import HumanMessage

async def main():
    app = FastAPI()
    async with lifespan(app):
        print("Connecting graph...")
        graph = get_graph()
        config = {"configurable": {"thread_id": "test_memory_123"}}
        inputs = {"messages": [HumanMessage(content="Hello!")]}
        print("Running graph...")
        async for event in graph.astream_events(inputs, config=config, version="v2"):
            if event["event"] == "on_chat_model_stream":
                pass
        
        print("Fetching state...")
        state = await graph.aget_state(config)
        print("State messages:", len(state.values.get("messages", [])))

if __name__ == "__main__":
    asyncio.run(main())
