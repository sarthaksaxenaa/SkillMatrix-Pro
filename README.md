# SkillMatrix-Pro

> AI-powered career acceleration platform with resume analysis, mock interviews, and skill gap tracking.

![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)
![Groq](https://img.shields.io/badge/Groq-Llama_3.1-orange)

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Resume Analyzer** | Upload a PDF resume, get AI-powered roast, readiness score, and skill gap analysis |
| **AI Mock Interviews** | Text and voice modes with live webcam proctoring and real-time grading |
| **Interview Results** | 10-question sessions with per-question scoring, optimal answers, and missed key points |
| **Resume Fixer** | AI generates improved, impact-driven bullet points |
| **AI Career Coach** | Context-aware chatbot for career guidance |
| **Competency Radar** | Custom SVG radar charts comparing your profile vs. ideal candidate |
| **Skill Importance Map** | Heatmap ranking detected skills by relevance to target role |
| **Score Trend Tracking** | Sparkline charts showing score progression across analyses |
| **Job Search Links** | Direct links to LinkedIn, Indeed, Glassdoor for your target role |
| **Command Palette** | `Ctrl+K` power-user navigation (search, navigate, quick actions) |
| **Confetti Celebration** | Animated celebration when scoring 80+ on readiness |
| **Mobile Responsive** | Bottom navigation bar for mobile, fully responsive layout |

## 🏗️ Tech Stack

| Layer | Technology | Port |
|-------|-----------|------|
| Frontend | React 19, Vite, Custom CSS | `5173` |
| Backend | Node.js, Express, MongoDB | `5000` |
| AI Engine | Python, FastAPI, Groq (Llama 3.1) | `8000` |

### Architecture

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│ React    │────▶│ Express  │────▶│ FastAPI +     │
│ Frontend │     │ Backend  │     │ Groq AI      │
│ :5173    │     │ :5000    │     │ :8000        │
└──────────┘     └──────────┘     └──────────────┘
                      │
                 ┌────┴────┐
                 │ MongoDB │
                 └─────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB running on `localhost:27017`

### Installation

```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install

# AI Engine
cd ai-engine && pip install -r requirements.txt
```

### Environment Variables

**AI Engine** (`ai-engine/.env`):
```env
GROQ_API_KEY=your_groq_api_key
MONGO_URI=mongodb://127.0.0.1:27017/skillmatrix
```

**Backend** (`backend/.env`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/skillmatrix
JWT_SECRET=your_jwt_secret
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
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

## 📁 Project Structure

```
SkillMatrix-Pro/
├── frontend/              # React + Vite SPA
│   └── src/
│       ├── config/        # API URLs, constants
│       ├── components/    # Reusable: Chatbot, SkillsChart
│       └── pages/         # Login, Dashboard, Interview
├── backend/               # Express API gateway
│   ├── config/            # Database connection
│   ├── middleware/         # JWT auth middleware
│   ├── models/            # Mongoose schemas
│   └── routes/            # Auth and AI proxy routes
├── ai-engine/             # FastAPI + Groq AI
│   ├── routes/            # Auth, chat, resume, interview
│   ├── role_profiles.py   # 60+ career profiles, 420+ keyword mappings
│   ├── config.py          # Centralized configuration
│   ├── models.py          # Pydantic request models
│   ├── helpers.py         # Resume parsing utilities
│   └── main.py            # App entry point
└── docs/                  # Documentation
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `⌘K` | Open command palette |
| `Escape` | Close palette / modals |

## 🤖 AI Engine Details

- **Model**: Groq (Llama 3.1 70B)
- **Resume Analysis**: Role-specific evaluation against 60+ career profiles with 420+ keyword mappings
- **Interview Grading**: 4-dimension scoring (Technical Accuracy, Depth, Communication, Real-world Application)
- **Question Generation**: FAANG-calibrated questions with adaptive difficulty

## 📄 License

MIT License — free for personal and commercial use.