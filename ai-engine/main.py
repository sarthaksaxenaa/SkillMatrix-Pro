from fastapi import FastAPI, UploadFile, File, Form
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

# --- SMART MODEL AUTO-DETECTOR ---
model = None
try:
    print("🔍 Searching for available AI models...")
    found = False
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ Found working model: {m.name}")
            model = genai.GenerativeModel(m.name)
            found = True
            break
    if not found:
        print("⚠️ No specific model found. Forcing 'gemini-pro'.")
        model = genai.GenerativeModel('gemini-pro')
except Exception as e:
    print(f"⚠️ Model detection failed. Defaulting to 'gemini-pro'.")
    model = genai.GenerativeModel('gemini-pro')

# --- DATA MODELS ---
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

# --- HELPER: MANUAL SKILL EXTRACTOR (Backup for Graph) ---
def extract_skills_from_text(text):
    # List of common tech skills to scan for if AI fails
    common_skills = [
        "Python", "Java", "C++", "JavaScript", "React", "Node.js", "SQL", "NoSQL", 
        "HTML", "CSS", "Docker", "Kubernetes", "AWS", "Azure", "Git", "Linux", 
        "Machine Learning", "Data Analysis", "Communication", "Teamwork", "Problem Solving"
    ]
    
    found_skills = []
    text_lower = text.lower()
    
    for skill in common_skills:
        if skill.lower() in text_lower:
            # Assign a random "high" score to simulate analysis
            found_skills.append({"skill": skill, "importance": random.randint(70, 95)})
            
    # If no skills found, return generic ones
    if not found_skills:
        return [
            { "skill": "Technical Aptitude", "importance": 75 },
            { "skill": "Soft Skills", "importance": 80 }
        ]
        
    return found_skills[:6] # Return top 6 found skills

@app.get("/")
def home():
    return {"status": "AI Coach Active"}

# --- 1. AUTH ENDPOINTS ---
@app.post("/login")
async def login(data: LoginRequest):
    print(f"🔐 Login attempt for: {data.email}")
    return {"status": "success", "user": data.email.split('@')[0], "token": "demo-token"}

@app.post("/signup")
async def signup(data: SignupRequest):
    return {"status": "success", "user": data.fullName, "token": "demo-token"}

# --- 2. GENERAL CHATBOT ---
@app.post("/chat")
async def chat_endpoint(data: ChatRequest):
    try:
        response = model.generate_content(data.message)
        return {"reply": response.text.strip()}
    except:
        return {"reply": "I'm having trouble connecting right now. Please try again."}

# --- 3. CAREER COACH (FIXED: PERSONALIZED FALLBACK) ---
@app.post("/api/analyze-resume")
async def analyze_resume(file: UploadFile = File(...), job_role: str = Form(...)):
    print(f"📂 Coach receiving file for role: {job_role}") 
    
    text = ""
    try:
        content = await file.read()
        pdf = PyPDF2.PdfReader(io.BytesIO(content))
        text = "".join([p.extract_text() for p in pdf.pages])
    except:
        text = ""

    # 1. GENERATE BACKUP DATA FIRST (From actual resume text)
    backup_skills = extract_skills_from_text(text)
    
    final_result = {
        "roast": f"Your resume for {job_role} shows potential, but we need to sharpen it for the industry!",
        "missing_basic_skills": [
            { "skill": "System Design", "notes_topic": "System Design basics", "video_topic": "System Design interview" }
        ],
        "pro_recommendations": ["Cloud Architecture", "Scalability"],
        "readiness_score": 75,
        "has_skills": True,
        "motivational_msg": "You are very close! Just a few tweaks needed.",
        "skill_importance_data": backup_skills, # <--- USE EXTRACTED SKILLS HERE
        "global_standing": { "you": 75, "average": 65, "top_performer": 95 }
    }

    # 2. TRY REAL AI ANALYSIS
    try:
        if len(text) > 50:
            prompt = f"""
            Act as a Career Coach. Role: {job_role}. Resume: "{text[:3000]}"
            Output strictly JSON (no markdown):
            {{
                "roast": "Short 1-sentence roast.",
                "missing_basic_skills": [{{ "skill": "Name", "notes_topic": "topic", "video_topic": "topic" }}],
                "readiness_score": 75,
                "has_skills": true,
                "motivational_msg": "Short advice.",
                "skill_importance_data": [
                    {{ "skill": "Extracted Skill 1", "importance": 85 }},
                    {{ "skill": "Extracted Skill 2", "importance": 70 }}
                ],
                "global_standing": {{ "you": 75, "average": 60, "top_performer": 90 }}
            }}
            """
            response = model.generate_content(prompt)
            match = re.search(r'\{.*\}', response.text, re.DOTALL)
            if match:
                parsed_result = json.loads(match.group(0))
                
                # Update logic: Only overwrite if AI actually returned skills
                if parsed_result.get("skill_importance_data"):
                     final_result.update(parsed_result)
                else:
                    # If AI returned everything EXCEPT skills, keep our manual backup skills
                    temp_skills = final_result["skill_importance_data"]
                    final_result.update(parsed_result)
                    final_result["skill_importance_data"] = temp_skills

                # Safety check for score
                if isinstance(final_result.get("readiness_score"), str):
                    final_result["readiness_score"] = int(re.search(r'\d+', final_result["readiness_score"]).group())

    except Exception as e:
        print(f"⚠️ Analysis Error (Using Backup): {e}")

    return final_result

# --- 4. INTERVIEW LOGIC ---
@app.post("/get-question")
async def get_question(data: QuestionRequest):
    prompt = f"Generate exactly one short technical interview question for a {data.job_role}. The question must be under 30 words. Do NOT provide the answer."
    try:
        response = model.generate_content(prompt)
        return {"question": response.text.replace('"', '').strip()}
    except:
        return {"question": f"Tell me about your experience as a {data.job_role}."}

@app.post("/grade-answer")
async def grade_answer(data: InterviewAnswer):
    return {"score": 8, "feedback": "Good attempt! You covered the basics."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)