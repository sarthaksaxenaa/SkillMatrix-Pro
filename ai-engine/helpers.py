"""
Helper/utility functions for resume processing and skill extraction.
"""

import random


# Common technical skills to match against in resumes
COMMON_SKILLS = [
    "Python", "Java", "C++", "React", "Node.js",
    "SQL", "HTML", "CSS", "AWS", "Git", "Linux", "Communication"
]

# Keywords that indicate a document is a real resume
RESUME_KEYWORDS = [
    "experience", "education", "skills", "projects", "summary",
    "objective", "contact", "professional", "history", "university",
    "college", "certification", "languages", "achievements"
]


def extract_skills_from_text(text):
    """Extract recognized skills from resume text and assign importance scores."""
    found = []
    text_lower = text.lower()

    for skill in COMMON_SKILLS:
        if skill.lower() in text_lower:
            found.append({"skill": skill, "importance": random.randint(60, 95)})

    if not found:
        return [
            {"skill": "Tech Basics", "importance": 70},
            {"skill": "Soft Skills", "importance": 80}
        ]

    return found[:7]


def is_valid_resume(text):
    """Check if the given text looks like a legitimate resume (not a random PDF)."""
    if len(text) < 100:
        return False

    text_lower = text.lower()
    found_count = sum(1 for keyword in RESUME_KEYWORDS if keyword in text_lower)
    return found_count >= 3
