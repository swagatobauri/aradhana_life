import os
# pyrefly: ignore [missing-import]
import jwt
# pyrefly: ignore [missing-import]
import bcrypt
from datetime import datetime, timedelta
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from backend.db.database import get_database
from backend.api.limiter import limiter

router = APIRouter()
JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-aradhana-key")

class UserRegister(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm="HS256")

@router.post("/register")
@limiter.limit("5/minute")
async def register(request: Request, user: UserRegister):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_pwd = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user_id = str(os.urandom(16).hex())
    
    await db.users.insert_one({
        "user_id": user_id,
        "email": user.email,
        "password": hashed_pwd,
        "created_at": datetime.utcnow()
    })
    
    token = create_access_token({"user_id": user_id, "email": user.email})
    return {"token": token, "user_id": user_id, "email": user.email}

@router.post("/login")
@limiter.limit("10/minute")
async def login(request: Request, user: UserLogin):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")
        
    db_user = await db.users.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    is_valid = bcrypt.checkpw(user.password.encode('utf-8'), db_user["password"].encode('utf-8'))
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    token = create_access_token({"user_id": db_user["user_id"], "email": db_user["email"]})
    return {"token": token, "user_id": db_user["user_id"], "email": db_user["email"]}
