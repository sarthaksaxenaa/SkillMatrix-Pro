"""
Authentication routes: signup and login.
"""

from fastapi import APIRouter, HTTPException, Request
from models import SignupRequest, LoginRequest

router = APIRouter()


@router.post("/signup")
async def signup(data: SignupRequest, request: Request):
    """Register a new user in MongoDB."""
    if await request.app.users_collection.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email taken")
    await request.app.users_collection.insert_one(data.dict())
    return {"status": "success", "user": data.fullName}


@router.post("/login")
async def login(data: LoginRequest, request: Request):
    """Authenticate an existing user."""
    user = await request.app.users_collection.find_one({"email": data.email})
    if not user or user["password"] != data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"status": "success", "user": user["fullName"], "token": "mongo-token"}
