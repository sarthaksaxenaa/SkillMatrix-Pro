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
    """
    DEPRECATED: Skill extraction is now handled by the AI model for higher accuracy.
    This remains as a backup to prevent import errors.
    """
    return [
        {"skill": "General Tech", "importance": 70},
        {"skill": "Soft Skills", "importance": 80}
    ]


def is_valid_resume(text):
    """Check if the given text looks like a legitimate resume (not a random PDF)."""
    if len(text) < 100:
        return False

    text_lower = text.lower()
    found_count = sum(1 for keyword in RESUME_KEYWORDS if keyword in text_lower)
    return found_count >= 3
