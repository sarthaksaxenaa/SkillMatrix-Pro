"""
Quick test script to verify Groq API connectivity.
Reads the API key from .env instead of hardcoding it.
"""

import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")

print("\n--- Testing Groq API ---")

if not API_KEY:
    print("[ERROR] GROQ_API_KEY not found in .env file!")
    print("------------------------\n")
    exit(1)

try:
    client = Groq(api_key=API_KEY)
    print("[INFO] Sending 'Hello' to AI...")

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": "Say hello in exactly 3 words."}]
    )

    print("[OK] GROQ WORKS! AI says:", completion.choices[0].message.content)
except Exception as e:
    print("[ERROR] GROQ FAILED! The error is:")
    print(e)

print("------------------------\n")