"""
Resume analysis and fixer routes.
"""

import json
import re
import io

import PyPDF2
from fastapi import APIRouter, UploadFile, File, Form

from config import groq_client, SELECTED_MODEL
from models import FixRequest
from helpers import extract_skills_from_text, is_valid_resume

router = APIRouter()


@router.post("/api/analyze-resume")
async def analyze(file: UploadFile = File(...), job_role: str = Form(...)):
    """Upload a PDF resume, extract text, and get AI-powered analysis."""
    text = ""
    try:
        content = await file.read()
        pdf = PyPDF2.PdfReader(io.BytesIO(content))
        text = "".join([p.extract_text() for p in pdf.pages])
    except Exception:
        return {"error": "Could not read PDF file."}

    if not is_valid_resume(text):
        return {
            "error": "Not a Resume",
            "message": "This document does not look like a resume. Please upload a valid CV containing sections like 'Experience', 'Education', or 'Skills'."
        }

    backup_skills = extract_skills_from_text(text)
    final = {
        "roast": f"A decent start for a {job_role}, but let's polish it up!",
        "missing_basic_skills": [{"skill": "System Design", "notes_topic": "System Design", "video_topic": "System Design"}],
        "readiness_score": 72,
        "has_skills": True,
        "motivational_msg": "Good foundation.",
        "skill_importance_data": backup_skills,
        "global_standing": {"you": 72, "average": 60, "top_performer": 90}
    }

    try:
        if groq_client:
            prompt = f"""Act as a Coach. Role: {job_role}. Resume: "{text[:2000]}". Output ONLY valid JSON, no markdown tags. Format: {{ "roast": "...", "readiness_score": 75, "skill_importance_data": [{{"skill": "A", "importance": 80}}] }}"""

            chat_completion = groq_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=SELECTED_MODEL,
                temperature=0.2
            )
            res_text = chat_completion.choices[0].message.content

            match = re.search(r'\{.*\}', res_text, re.DOTALL)
            if match:
                parsed = json.loads(match.group(0))
                if parsed.get("skill_importance_data"):
                    final.update(parsed)
                else:
                    temp = final["skill_importance_data"]
                    final.update(parsed)
                    final["skill_importance_data"] = temp
    except Exception as e:
        print("JSON parse error:", e)

    return final


@router.post("/fix-resume")
async def fix_resume(data: FixRequest):
    """Generate improved resume bullet points using AI."""
    try:
        if not groq_client:
            return {"fixed_points": ["AI Model not loaded."]}

        prompt = f"""
        Act as a Senior Resume Writer. Job Role: {data.job_role}. Resume Text: "{data.resume_text[:2000]}..."
        Task: Rewrite 3 bullet points to be impressive. Output ONLY valid JSON, no markdown. Format: {{ "fixed_points": ["...", "...", "..."] }}
        """

        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=SELECTED_MODEL,
            temperature=0.3
        )
        res_text = chat_completion.choices[0].message.content

        match = re.search(r'\{.*\}', res_text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        return {"fixed_points": ["Could not parse fixes. Try again."]}
    except Exception:
        return {"fixed_points": ["Could not generate fixes. Try again."]}
