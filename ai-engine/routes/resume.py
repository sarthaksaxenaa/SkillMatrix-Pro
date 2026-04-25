"""
Resume analysis and fixer routes.
Role-specific AI evaluation engine with Google-grade accuracy.
"""

import json
import re
import io

import PyPDF2
from fastapi import APIRouter, UploadFile, File, Form

from config import groq_client, SELECTED_MODEL
from models import FixRequest
from helpers import is_valid_resume

router = APIRouter()


# ---------------------------------------------------------------------------
# Role-specific skill databases — the AI uses these as evaluation anchors.
# Each role has core skills, nice-to-haves, and evaluation focus areas.
# ---------------------------------------------------------------------------
ROLE_PROFILES = {
    "default": {
        "core_skills": ["Communication", "Problem Solving", "Teamwork", "Adaptability", "Critical Thinking"],
        "evaluation_focus": "general professional competence and transferable skills",
        "industry_context": "general industry"
    },
    "software engineer": {
        "core_skills": ["Data Structures & Algorithms", "System Design", "REST APIs", "Git/Version Control",
                        "SQL/Databases", "OOP Principles", "Testing/TDD", "CI/CD", "Cloud (AWS/GCP/Azure)"],
        "evaluation_focus": "coding proficiency, system design thinking, scalable architecture, code quality, and engineering rigor",
        "industry_context": "software engineering at top tech companies (Google, Meta, Apple, Amazon)"
    },
    "data scientist": {
        "core_skills": ["Python/R", "Machine Learning", "Statistics & Probability", "SQL",
                        "Data Visualization (Matplotlib/Tableau)", "Pandas/NumPy", "Deep Learning",
                        "Feature Engineering", "A/B Testing", "Model Deployment"],
        "evaluation_focus": "statistical rigor, ML model selection, experiment design, data storytelling, and business impact of analyses",
        "industry_context": "data science at top tech and analytics companies"
    },
    "data analyst": {
        "core_skills": ["SQL (Advanced)", "Excel/Google Sheets", "Data Visualization (Tableau/Power BI)",
                        "Python/R for analysis", "Statistics", "ETL Pipelines", "Business Acumen",
                        "Dashboard Design", "A/B Testing"],
        "evaluation_focus": "analytical thinking, dashboard design, data-driven decision making, and translating data into business insights",
        "industry_context": "data analytics at product companies"
    },
    "product manager": {
        "core_skills": ["Product Strategy", "User Research", "A/B Testing", "Roadmapping",
                        "Stakeholder Management", "Metrics (KPIs/OKRs)", "Wireframing",
                        "Competitive Analysis", "Go-to-Market Strategy"],
        "evaluation_focus": "product thinking, user empathy, metrics-driven decisions, cross-functional leadership, and business outcomes",
        "industry_context": "product management at consumer and enterprise tech companies"
    },
    "frontend developer": {
        "core_skills": ["JavaScript/TypeScript", "React/Vue/Angular", "HTML5/CSS3", "Responsive Design",
                        "State Management", "Web Performance", "Accessibility (a11y)",
                        "RESTful APIs", "Testing (Jest/Cypress)"],
        "evaluation_focus": "UI/UX sensibility, component architecture, performance optimization, cross-browser compatibility, and modern frontend patterns",
        "industry_context": "frontend engineering at design-forward companies"
    },
    "backend developer": {
        "core_skills": ["Node.js/Python/Java/Go", "REST/GraphQL APIs", "Database Design (SQL/NoSQL)",
                        "Authentication/Authorization", "Caching (Redis)", "Message Queues",
                        "Microservices", "Docker/Kubernetes", "System Design"],
        "evaluation_focus": "API design, database optimization, scalability patterns, security best practices, and distributed systems thinking",
        "industry_context": "backend engineering at high-scale companies"
    },
    "devops engineer": {
        "core_skills": ["Docker/Kubernetes", "CI/CD (Jenkins/GitHub Actions)", "Terraform/IaC",
                        "AWS/GCP/Azure", "Linux Administration", "Monitoring (Prometheus/Grafana)",
                        "Networking", "Security (IAM/Vault)", "Scripting (Bash/Python)"],
        "evaluation_focus": "infrastructure automation, reliability engineering, deployment pipelines, incident management, and cloud architecture",
        "industry_context": "DevOps/SRE at cloud-native companies"
    },
    "machine learning engineer": {
        "core_skills": ["Python", "TensorFlow/PyTorch", "ML Pipelines", "Model Optimization",
                        "MLOps (MLflow/Kubeflow)", "Feature Stores", "Distributed Training",
                        "Model Serving", "Data Engineering"],
        "evaluation_focus": "ML system design, model training at scale, production ML pipelines, model monitoring, and bridging research to production",
        "industry_context": "ML engineering at AI-first companies"
    },
    "ui/ux designer": {
        "core_skills": ["Figma/Sketch", "User Research", "Wireframing/Prototyping", "Design Systems",
                        "Usability Testing", "Information Architecture", "Interaction Design",
                        "Visual Design", "Accessibility"],
        "evaluation_focus": "design thinking, user empathy, visual hierarchy, interaction patterns, and measurable UX improvements",
        "industry_context": "product design at design-led companies (Apple, Airbnb, Stripe)"
    },
    "cybersecurity analyst": {
        "core_skills": ["Network Security", "SIEM Tools", "Penetration Testing", "Incident Response",
                        "Vulnerability Assessment", "Compliance (GDPR/SOC2)", "Firewalls/IDS",
                        "Cryptography", "Threat Modeling"],
        "evaluation_focus": "threat detection, vulnerability analysis, security architecture, incident response time, and compliance adherence",
        "industry_context": "cybersecurity at enterprise and fintech companies"
    }
}


def get_role_profile(job_role: str) -> dict:
    """Match the user's job role input to the closest profile."""
    role_lower = job_role.lower().strip()
    # Direct match
    if role_lower in ROLE_PROFILES:
        return ROLE_PROFILES[role_lower]
    # Partial match
    for key, profile in ROLE_PROFILES.items():
        if key in role_lower or role_lower in key:
            return profile
    # Keyword match
    keyword_map = {
        "sde": "software engineer", "swe": "software engineer", "developer": "software engineer",
        "full stack": "software engineer", "fullstack": "software engineer",
        "data sci": "data scientist", "ml": "machine learning engineer",
        "ai engineer": "machine learning engineer",
        "frontend": "frontend developer", "front end": "frontend developer", "react": "frontend developer",
        "backend": "backend developer", "back end": "backend developer",
        "devops": "devops engineer", "sre": "devops engineer", "infrastructure": "devops engineer",
        "product": "product manager", "pm": "product manager",
        "analyst": "data analyst", "business analyst": "data analyst",
        "designer": "ui/ux designer", "ux": "ui/ux designer", "ui": "ui/ux designer",
        "security": "cybersecurity analyst", "cyber": "cybersecurity analyst",
    }
    for keyword, mapped_role in keyword_map.items():
        if keyword in role_lower:
            return ROLE_PROFILES[mapped_role]
    return ROLE_PROFILES["default"]


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
- missing_basic_skills: List skills from [{core_skills_str}] that are ABSENT or weak in the resume. Only list truly missing ones.
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
