# SkillMatrix-Pro

AI-powered career acceleration platform with resume analysis, mock interviews, and skill gap tracking.

## Tech Stack

| Layer | Technology | Port |
|-------|-----------|------|
| Frontend | React 19, Vite, TailwindCSS | `5173` |
| Backend | Node.js, Express, MongoDB | `5000` |
| AI Engine | Python, FastAPI, Groq (Llama 3.1) | `8000` |

## Features

- **Resume Analyzer** — Upload a PDF resume, get AI-powered roast, readiness score, and skill gap analysis
- **AI Mock Interviews** — Text and voice modes with live webcam proctoring
- **AI Chatbot** — General-purpose career assistant
- **Resume Fixer** — AI generates improved bullet points
- **Job Search Links** — Direct links to LinkedIn, Indeed, Glassdoor for your target role

## Setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB running on `localhost:27017`

### Installation

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install

# AI Engine
cd ai-engine
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in `ai-engine/` with:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/skillmatrix
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

### Running

```bash
# Terminal 1: Frontend
cd frontend && npm run dev

# Terminal 2: Backend
cd backend && npm start

# Terminal 3: AI Engine
cd ai-engine && python main.py
```

## Project Structure

```
SkillMatrix-Pro/
├── frontend/          # React + Vite SPA
│   └── src/
│       ├── config/    # API URLs, constants
│       ├── components/# Reusable components (Chatbot, SkillsChart)
│       └── pages/     # Page components (Login, Dashboard, Interview)
├── backend/           # Express API gateway
│   ├── config/        # Database connection
│   ├── middleware/     # JWT auth middleware
│   ├── models/        # Mongoose schemas
│   └── routes/        # Auth and AI proxy routes
├── ai-engine/         # FastAPI + Groq AI
│   ├── routes/        # Auth, chat, resume, interview endpoints
│   ├── config.py      # Centralized configuration
│   ├── models.py      # Pydantic request models
│   ├── helpers.py     # Resume parsing utilities
│   └── main.py        # App entry point
└── docs/              # Documentation
```