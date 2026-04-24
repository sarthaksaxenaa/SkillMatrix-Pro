"""
Interview routes: question generation and answer grading.
"""

import json
import re

from fastapi import APIRouter

from config import groq_client, SELECTED_MODEL
from models import QuestionRequest, InterviewAnswer

router = APIRouter()


@router.post("/get-question")
async def get_question(data: QuestionRequest):
    """Generate a technical interview question for the given job role."""
    try:
        if groq_client:
            chat_completion = groq_client.chat.completions.create(
                messages=[{"role": "user", "content": f"Provide exactly one short technical interview question for a {data.job_role}. Maximum 20 words. No intro or outro text."}],
                model=SELECTED_MODEL,
                temperature=0.7
            )
            return {"question": chat_completion.choices[0].message.content.strip()}
        return {"question": "Tell me about yourself."}
    except Exception:
        return {"question": "Tell me about yourself."}


@router.post("/grade-answer")
async def grade_answer(data: InterviewAnswer):
    """Grade a candidate's answer using AI and return score + feedback."""
    try:
        if not groq_client:
            return {"score": 8, "feedback": "Good job. (AI disabled)."}

        prompt = f"""
        Act as a tough but fair technical interviewer.
        Question asked: "{data.question}"
        Candidate's Answer: "{data.user_answer}"
        
        Grade the answer from 1 to 10 based on accuracy, clarity, and completeness.
        Output ONLY valid JSON format: {{ "score": 8, "feedback": "2 short sentences of specific feedback." }}
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

        return {"score": 7, "feedback": "Decent answer, but could be more specific."}
    except Exception as e:
        print(f"Grading Error: {e}")
        return {"score": 5, "feedback": "Error analyzing answer. Try again!"}
