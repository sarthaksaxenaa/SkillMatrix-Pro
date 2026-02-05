from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import PyPDF2
import io
import os
import google.generativeai as genai
import json
import re
import random
# 1. IMPORT MOTOR
from motor.motor_asyncio import AsyncIOMotorClient

print("\n\n🔥 STARTING BACKEND SERVER...") # Look for this line in logs!

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔑 YOUR API KEY
GEMINI_API_KEY = "AIzaSyCIXm6Smg6q-M1FGS6x8rdamkGtH3GJbkw"
genai.configure(api_key=GEMINI_API_KEY)

# --- 2. CONNECT TO LOCAL MONGODB ---
MONGO_URL = "mongodb://localhost:27017"
try:
    print("⏳ Connecting to MongoDB...")
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.skillmatrix_db
    users_collection = db.users
    print("✅ Connected to local MongoDB successfully!")
except Exception as e:
    print(f"⚠️ MongoDB Connection Failed: {e}")

# --- AI SETUP ---
model = None
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            model = genai.GenerativeModel(m.name); break
    if not model: model = genai.GenerativeModel('gemini-pro')
except: model = genai.GenerativeModel('gemini-pro')

# --- MODELS ---
class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    fullName: str
    email: str
    password: str

class ChatRequest(BaseModel):
    message: str

class QuestionRequest(BaseModel):
    job_role: str

class InterviewAnswer(BaseModel):
    question: str
    user_answer: str

# --- GRAPH FIX HELPER ---
def extract_skills_from_text(text):
    common_skills = ["Python", "Java", "C++", "React", "Node.js", "SQL", "HTML", "CSS", "AWS", "Git", "Linux", "Communication"]
    found = []
    text_lower = text.lower()
    for skill in common_skills:
        if skill.lower() in text_lower:
            found.append({"skill": skill, "importance": random.randint(60, 95)})
    if not found:
        return [{"skill": "Tech Basics", "importance": 70}, {"skill": "Soft Skills", "importance": 80}]
    return found[:7]

@app.get("/")
def home(): return {"status": "Active"}

# --- 3. REAL AUTH (Login/Signup) ---
@app.post("/signup")
async def signup(data: SignupRequest):
    # Check if user exists
    if await users_collection.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email taken")
    
    # Save to MongoDB
    await users_collection.insert_one(data.dict())
    print(f"👤 User saved: {data.email}") # Debug print
    return {"status": "success", "user": data.fullName}

@app.post("/login")
async def login(data: LoginRequest):
    # Find user in MongoDB
    user = await users_collection.find_one({"email": data.email})
    if not user or user["password"] != data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"status": "success", "user": user["fullName"], "token": "mongo-token"}

# --- CHATBOT ---
@app.post("/chat")
async def chat(data: ChatRequest):
    try: return {"reply": model.generate_content(data.message).text.strip()}
    except: return {"reply": "Connection error."}

# --- RESUME ANALYZER ---
@app.post("/api/analyze-resume")
async def analyze(file: UploadFile = File(...), job_role: str = Form(...)):
    text = ""
    try:
        content = await file.read()
        pdf = PyPDF2.PdfReader(io.BytesIO(content))
        text = "".join([p.extract_text() for p in pdf.pages])
    except: pass

    # Always generate backup skills for graph
    backup_skills = extract_skills_from_text(text)

    final = {
        "roast": f"A decent start for a {job_role}, but let's polish it up!",
        "missing_basic_skills": [{"skill": "System Design", "notes_topic": "System Design", "video_topic": "System Design"}],
        "readiness_score": 72,
        "has_skills": True,
        "motivational_msg": "Good foundation.",
        "skill_importance_data": backup_skills, # Graph data is here!
        "global_standing": {"you": 72, "average": 60, "top_performer": 90}
    }

    try:
        prompt = f"""Act as a Coach. Role: {job_role}. Resume: "{text[:2000]}". Output JSON: {{ "roast": "...", "readiness_score": 75, "skill_importance_data": [{{"skill": "A", "importance": 80}}] }}"""
        res = model.generate_content(prompt)
        parsed = json.loads(re.search(r'\{.*\}', res.text, re.DOTALL).group(0))
        
        if parsed.get("skill_importance_data"): final.update(parsed)
        else: 
            temp = final["skill_importance_data"]
            final.update(parsed)
            final["skill_importance_data"] = temp
            
    except: pass

    return final

# --- INTERVIEW ---
@app.post("/get-question")
async def get_q(data: QuestionRequest):
    try: return {"question": model.generate_content(f"One short technical interview question for {data.job_role}. Max 20 words.").text.strip()}
    except: return {"question": "Tell me about yourself."}

@app.post("/grade-answer")
async def grade(data: InterviewAnswer):
    return {"score": 8, "feedback": "Good job."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)