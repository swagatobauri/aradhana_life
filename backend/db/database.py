import os

# We will initialize the client when the FastAPI app starts
client = None
db = None

def get_database():
    return db

async def connect_to_mongo():
    global client, db
    MONGODB_URI = os.getenv("MONGODB_URI")
    if MONGODB_URI:
        try:
            # Lazy import so a bad pymongo version doesn't crash on startup
            # pyrefly: ignore [missing-import]
            from motor.motor_asyncio import AsyncIOMotorClient
            client = AsyncIOMotorClient(MONGODB_URI)
            db = client.aradhana_life
            print("Connected to MongoDB!")
        except Exception as e:
            print(f"WARNING: Could not connect to MongoDB: {e}. Database features disabled.")
    else:
        print("WARNING: MONGODB_URI not set. Database features will not work.")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("Closed MongoDB connection.")
