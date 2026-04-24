"""
Pydantic data models for API request/response validation.
"""

from pydantic import BaseModel


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


class FixRequest(BaseModel):
    resume_text: str
    job_role: str
