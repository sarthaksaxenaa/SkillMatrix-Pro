"""
Resume analysis and fixer routes.
Role-specific AI evaluation engine with Google-grade accuracy.
"""

import json
import re
import io
import sys
import os

import PyPDF2
from fastapi import APIRouter, UploadFile, File, Form

from config import groq_client, SELECTED_MODEL
from models import FixRequest
from helpers import is_valid_resume

# Import expanded role profiles (55+ roles, 200+ keyword mappings)
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from role_profiles import get_role_profile

router = APIRouter()




@router.post("/api/analyze-resume")
async def analyze(file: UploadFile = File(...), job_role: str = Form(...)):
    """Upload a PDF resume, extract text, and get AI-powered role-specific analysis."""
    text = ""
    try:
        content = await file.read()
        pdf = PyPDF2.PdfReader(io.BytesIO(content))
        text = "".join([p.extract_text() or "" for p in pdf.pages])
    except Exception:
        return {"error": "Could not read PDF file."}

    if not is_valid_resume(text):
        return {
            "error": "Not a Resume",
            "message": "This document does not look like a resume. Please upload a valid CV containing sections like 'Experience', 'Education', or 'Skills'."
        }

    # Get role-specific evaluation profile
    role_profile = get_role_profile(job_role)
    core_skills_str = ", ".join(role_profile["core_skills"])
    advanced_skills_str = ", ".join(role_profile.get("advanced_skills", []))
    tools_str = ", ".join(role_profile.get("tools_and_platforms", []))

    # Default structure — role-aware fallback
    final = {
        "roast": f"Your resume shows potential for a {job_role} role, but it needs sharper impact metrics and deeper technical storytelling to stand out at a top-tier company.",
        "readiness_score": 50,
        "sub_scores": {
            "technical_depth": 50,
            "impact_metrics": 40,
            "clarity_precision": 55,
            "role_alignment": 45
        },
        "missing_basic_skills": [
            {"skill": role_profile["core_skills"][0], "notes_topic": f"{role_profile['core_skills'][0]} tutorial", "video_topic": f"{role_profile['core_skills'][0]} crash course"},
            {"skill": role_profile["core_skills"][1], "notes_topic": f"{role_profile['core_skills'][1]} guide", "video_topic": f"{role_profile['core_skills'][1]} tutorial"},
        ],
        "skill_importance_data": [
            {"skill": s, "importance": 90 - i * 5} for i, s in enumerate(role_profile["core_skills"][:6])
        ],
        "top_strengths": [
            "Shows initiative through personal projects",
            "Demonstrates foundational technical knowledge",
            "Resume is structured and readable"
        ],
        "areas_for_improvement": [
            f"Add quantifiable metrics relevant to {job_role} (%, $, numbers)",
            f"Demonstrate deeper ownership in {role_profile['evaluation_focus'].split(',')[0]}",
            f"Tailor experience descriptions specifically to {job_role}"
        ],
        "global_standing": {"you": 50, "average": 60, "top_performer": 95},
        "has_skills": True,
        "motivational_msg": f"The {job_role} bar is high, but so is your potential."
    }

    try:
        if groq_client:
            prompt = f"""You are a Senior Hiring Manager at Google with 15+ years of experience hiring specifically for {job_role} positions.

CRITICAL INSTRUCTION: You must evaluate this resume ONLY through the lens of a {job_role} role. A resume strong for one role can be completely weak for another.

TARGET ROLE: {job_role}
ROLE CONTEXT: Evaluate against standards in {role_profile['industry_context']}.
EVALUATION FOCUS: {role_profile['evaluation_focus']}.
MUST-HAVE SKILLS FOR THIS ROLE: {core_skills_str}
ADVANCED/SENIOR-LEVEL SKILLS: {advanced_skills_str}
INDUSTRY TOOLS & PLATFORMS: {tools_str}

RESUME TEXT:
{text[:4000]}

SCORING RULES (STRICT):
- readiness_score: How ready is this person for a {job_role} role SPECIFICALLY? 
  * 0-25: No relevant experience or skills for {job_role}
  * 26-45: Has some transferable skills but major gaps for {job_role}
  * 46-65: Decent foundation but missing key {job_role} competencies
  * 66-80: Strong candidate with minor gaps
  * 81-100: Exceptional, ready for senior {job_role} at a top company
- sub_scores.role_alignment: How well does this resume align with {job_role}? If someone has web dev experience but applies for Data Scientist, this should be LOW (20-35).
- sub_scores.technical_depth: Rate depth of skills RELEVANT to {job_role} only. Irrelevant skills don't count.
- missing_basic_skills: List skills from [{core_skills_str}, {advanced_skills_str}] that are ABSENT or weak in the resume. Only list truly missing ones. Include both core AND advanced skills that are missing.
- skill_importance_data: Rate skills FOUND in the resume by their importance TO {job_role} specifically.

Return ONLY a valid JSON object. No markdown, no explanation, no code blocks.
{{
  "roast": "2-3 sentences. Be brutally specific about gaps for {job_role}. Reference actual content from the resume.",
  "readiness_score": 42,
  "sub_scores": {{
    "technical_depth": 45,
    "impact_metrics": 30,
    "clarity_precision": 55,
    "role_alignment": 35
  }},
  "missing_basic_skills": [
    {{"skill": "Specific Skill", "notes_topic": "Search query for learning", "video_topic": "YouTube search query"}}
  ],
  "skill_importance_data": [
    {{"skill": "Found Skill", "importance": 85}}
  ],
  "top_strengths": ["Specific strength 1", "Specific strength 2", "Specific strength 3"],
  "areas_for_improvement": ["Specific improvement 1", "Specific improvement 2", "Specific improvement 3"],
  "global_standing": {{"you": 42, "average": 60, "top_performer": 95}}
}}"""

            chat_completion = groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": f"You are a {job_role} hiring expert. Always evaluate resumes specifically for {job_role}. Return only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                model=SELECTED_MODEL,
                temperature=0.15,
                max_tokens=1800
            )
            res_text = chat_completion.choices[0].message.content
            print(f"[AI RAW RESPONSE for {job_role}]: {res_text[:500]}")

            match = re.search(r'\{.*\}', res_text, re.DOTALL)
            if match:
                parsed = json.loads(match.group(0))
                print(f"[AI PARSED KEYS for {job_role}]: {list(parsed.keys())}")

                # --- SAFE MERGE: Only accept non-empty, valid fields ---
                if isinstance(parsed.get("roast"), str) and len(parsed["roast"]) > 10:
                    final["roast"] = parsed["roast"]

                if isinstance(parsed.get("readiness_score"), (int, float)) and 0 <= parsed["readiness_score"] <= 100:
                    final["readiness_score"] = int(parsed["readiness_score"])

                if isinstance(parsed.get("sub_scores"), dict):
                    for key in ["technical_depth", "impact_metrics", "clarity_precision", "role_alignment"]:
                        val = parsed["sub_scores"].get(key)
                        if isinstance(val, (int, float)) and 0 <= val <= 100:
                            final["sub_scores"][key] = int(val)

                if isinstance(parsed.get("missing_basic_skills"), list) and len(parsed["missing_basic_skills"]) > 0:
                    valid_skills = [s for s in parsed["missing_basic_skills"] if isinstance(s, dict) and s.get("skill")]
                    if valid_skills:
                        final["missing_basic_skills"] = valid_skills

                if isinstance(parsed.get("skill_importance_data"), list) and len(parsed["skill_importance_data"]) > 0:
                    valid_data = [s for s in parsed["skill_importance_data"] if isinstance(s, dict) and s.get("skill") and isinstance(s.get("importance"), (int, float))]
                    if valid_data:
                        final["skill_importance_data"] = valid_data

                if isinstance(parsed.get("top_strengths"), list) and len(parsed["top_strengths"]) > 0:
                    valid_strengths = [s for s in parsed["top_strengths"] if isinstance(s, str) and len(s) > 3]
                    if valid_strengths:
                        final["top_strengths"] = valid_strengths

                if isinstance(parsed.get("areas_for_improvement"), list) and len(parsed["areas_for_improvement"]) > 0:
                    valid_improvements = [s for s in parsed["areas_for_improvement"] if isinstance(s, str) and len(s) > 3]
                    if valid_improvements:
                        final["areas_for_improvement"] = valid_improvements

                if isinstance(parsed.get("global_standing"), dict):
                    gs = parsed["global_standing"]
                    if all(isinstance(gs.get(k), (int, float)) for k in ["you", "average", "top_performer"]):
                        final["global_standing"] = {
                            "you": int(gs["you"]),
                            "average": int(gs["average"]),
                            "top_performer": int(gs["top_performer"])
                        }

                final["has_skills"] = len(final.get("skill_importance_data", [])) > 0
            else:
                print(f"[AI ERROR for {job_role}]: Could not find JSON in AI response")
    except Exception as e:
        print(f"[AI EXCEPTION for {job_role}]: {type(e).__name__}: {e}")

    return final


@router.post("/fix-resume")
async def fix_resume(data: FixRequest):
    """Generate improved resume bullet points using AI."""
    try:
        if not groq_client:
            return {"fixed_points": ["AI Model not loaded."]}

        prompt = f"""
        Act as a Senior Resume Writer specializing in {data.job_role} roles.
        Resume Text: "{data.resume_text[:2000]}..."
        Task: Rewrite 3 bullet points to be impressive and tailored for a {data.job_role} position.
        Use strong action verbs and include quantifiable metrics.
        Output ONLY valid JSON, no markdown. Format: {{ "fixed_points": ["...", "...", "..."] }}
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
