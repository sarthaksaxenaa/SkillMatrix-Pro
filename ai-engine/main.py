"""
SkillMatrix-Pro AI Engine
FastAPI server providing resume analysis, interview grading, chatbot, and auth.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import uvicorn

from config import MONGO_URL, DB_NAME
from routes.auth import router as auth_router
from routes.chat import router as chat_router
from routes.resume import router as resume_router
from routes.interview import router as interview_router

# --- App Setup ---
print("\n" + "=" * 50)
print("🔥 STARTING AI ENGINE - SKILLMATRIX PRO 🔥")
print("=" * 50 + "\n")

app = FastAPI(title="SkillMatrix-Pro AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MongoDB Lifecycle ---
@app.on_event("startup")
async def startup_db_client():
    """Connect to MongoDB on server startup."""
    try:
        print("⏳ Attempting to connect to MongoDB...")
        app.mongodb_client = AsyncIOMotorClient(MONGO_URL)
        app.db = app.mongodb_client[DB_NAME]
        app.users_collection = app.db.users
        await app.db.command("ping")
        print("✅ SUCCESS: Connected to local MongoDB!")
    except Exception as e:
        print(f"❌ ERROR: MongoDB Connection Failed: {e}")


# --- Health Check ---
@app.get("/")
def home():
    """Basic health check endpoint."""
    return {"status": "Active"}


# --- Register Route Modules ---
app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(resume_router)
app.include_router(interview_router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)