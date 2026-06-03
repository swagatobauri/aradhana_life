import os
# pyrefly: ignore [missing-import]
from motor.motor_asyncio import AsyncIOMotorClient

# Get the MongoDB URI from the environment variables
MONGODB_URI = os.getenv("MONGODB_URI")

# We will initialize the client when the FastAPI app starts
client = None
db = None

def get_database():
    return db

async def connect_to_mongo():
    global client, db
    if MONGODB_URI:
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client.aradhana_life
        print("Connected to MongoDB!")
    else:
        print("WARNING: MONGODB_URI not set. Database features will not work.")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("Closed MongoDB connection.")
