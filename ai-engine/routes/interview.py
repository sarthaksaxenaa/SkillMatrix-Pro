"""
Interview routes: question generation and answer grading.
Enhanced with realistic questions, optimal solutions, and batch question support.
"""

import json
import re

from fastapi import APIRouter

from config import groq_client, SELECTED_MODEL
from models import QuestionRequest, InterviewAnswer

router = APIRouter()


@router.post("/get-question")
async def get_question(data: QuestionRequest):
    """Generate a realistic technical interview question for the given job role."""
    try:
        if groq_client:
            prompt = f"""You are a senior technical interviewer at a top-tier company (Google, Meta, Amazon level).

Generate exactly ONE realistic interview question for a "{data.job_role}" role.

Rules:
- The question MUST be something actually asked in real interviews at top companies.
- Mix between: system design, coding/algorithm, behavioral (STAR format), domain-specific, and scenario-based questions.
- Be specific and challenging — not generic. Reference real technologies, frameworks, or scenarios.
- The question should require a 2-4 minute thoughtful answer.
- Maximum 40 words for the question.
- Output ONLY the question text, nothing else. No quotes, no numbering, no intro."""

            chat_completion = groq_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=SELECTED_MODEL,
                temperature=0.85
            )
            question = chat_completion.choices[0].message.content.strip().strip('"').strip("'")
            return {"question": question}
        return {"question": "Walk me through a project you led that had significant technical challenges. What tradeoffs did you make and why?"}
    except Exception:
        return {"question": "Describe a time when you had to debug a critical production issue under pressure. What was your approach?"}


@router.post("/grade-answer")
async def grade_answer(data: InterviewAnswer):
    """Grade a candidate's answer using AI and return score + feedback + optimal answer."""
    try:
        if not groq_client:
            return {
                "score": 7,
                "feedback": "Good answer with room for improvement.",
                "optimal_answer": "An ideal answer would include specific examples, metrics, and demonstrate clear technical depth.",
                "key_points_missed": ["Specific metrics or data", "Technical depth", "Impact assessment"]
            }

        prompt = f"""You are a senior technical interviewer at Google. Grade this interview answer rigorously.

Question: "{data.question}"
Candidate's Answer: "{data.user_answer}"

Evaluate based on:
1. Technical Accuracy (is it correct?)
2. Depth & Completeness (did they cover all key aspects?)
3. Communication Clarity (was it well-structured?)
4. Real-world Application (did they show practical understanding?)

Output ONLY valid JSON in this exact format:
{{
  "score": 7,
  "feedback": "2-3 sentences of specific, actionable feedback. Be constructive but honest.",
  "optimal_answer": "Write a concise 3-5 sentence ideal answer that a top candidate would give. Include specific technical details.",
  "key_points_missed": ["point 1", "point 2", "point 3"]
}}"""

        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=SELECTED_MODEL,
            temperature=0.3
        )
        res_text = chat_completion.choices[0].message.content

        match = re.search(r'\{.*\}', res_text, re.DOTALL)
        if match:
            result = json.loads(match.group(0))
            # Ensure all required fields exist
            result.setdefault("optimal_answer", "No optimal answer generated.")
            result.setdefault("key_points_missed", [])
            result.setdefault("score", 5)
            result.setdefault("feedback", "Answer evaluated.")
            return result

        return {
            "score": 6,
            "feedback": "Your answer shows understanding but lacks depth in key areas. Try to include specific examples and technical details.",
            "optimal_answer": "An ideal answer would demonstrate both theoretical knowledge and practical experience with concrete examples.",
            "key_points_missed": ["Specific examples", "Technical depth", "Structured approach"]
        }
    except Exception as e:
        print(f"Grading Error: {e}")
        return {
            "score": 5,
            "feedback": "Error analyzing answer. The response structure was unclear.",
            "optimal_answer": "Could not generate optimal answer due to processing error.",
            "key_points_missed": []
        }
