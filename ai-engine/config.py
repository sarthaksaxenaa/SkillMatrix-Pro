"""
Centralized configuration for the AI Engine.
Loads environment variables and initializes the Groq AI client.
"""

import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables from .env file
load_dotenv()

# --- Groq AI Configuration ---
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
SELECTED_MODEL = "llama-3.1-8b-instant"

# --- MongoDB Configuration ---
MONGO_URL = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "skillmatrix_db"

# --- Initialize Groq Client ---
groq_client = None

try:
    if GROQ_API_KEY:
        groq_client = Groq(api_key=GROQ_API_KEY)
        print(f"✅ SUCCESS: Using Groq AI Model -> {SELECTED_MODEL}")
    else:
        print("⚠️ WARNING: Groq API Key not set. AI features will be disabled.")
except Exception as e:
    print(f"❌ CRITICAL: Groq Setup Error: {e}")
