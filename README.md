# CoursePilot

> AI-powered student dashboard that transforms unstructured academic materials into actionable schedules and study support tools.

## 🎯 Project Overview

**CoursePilot** reduces cognitive overload for busy college students by automatically extracting important dates and events from PDF syllabi and creating a centralized, intelligent calendar with built-in study reminders.

### Core Features
- 📄 **Smart PDF Parsing**: Upload syllabi and let AI extract all important dates
- 📅 **Unified Calendar**: All courses in one place with real-time updates
- 🔔 **Intelligent Reminders**: Customizable notifications for exams, assignments, and deadlines
- ✅ **Study Checklists**: AI-generated next steps for each event
- 👤 **Human-in-the-Loop**: Review and confirm AI-extracted events before they go live

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI
- **Auth**: Firebase Authentication

### Backend
- **Framework**: FastAPI (Async)
- **Language**: Python 3.11+
- **Database**: Google Firestore
- **Task Queue**: Celery + Redis
- **AI/Parsing**: LlamaParse + OpenAI GPT-4o-mini

### Deployment
- **Frontend**: Vercel
- **Backend**: Render/Railway

## 📁 Repository Structure

```
coursepilot/
├── frontend/               # Next.js Application
│   ├── app/                # App Router Pages
│   └── components/         # UI Components
├── backend/                # FastAPI Application
│   ├── app/
│   │   ├── main.py         # Entry point
│   │   ├── models/         # Pydantic Schemas
│   │   ├── routes/         # API Endpoints
│   │   └── tasks/          # Celery Background Tasks
│   ├── celery_app.py       # Celery Config
│   └── requirements.txt
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.11+
- Redis (for Celery)
- Firebase project with Firestore enabled

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local  # Add your Firebase config
npm run dev
```

Frontend runs at `http://localhost:3000`

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Add your API keys
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`

### Celery Worker Setup

```bash
# In a new terminal, from backend/
redis-server  # Start Redis
celery -A celery_app worker --loglevel=info
```

## 🤝 Contributing

We're a team of 10 working in this monorepo. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for our workflow, branch naming conventions, and PR guidelines.

**Quick Rules:**
- Always branch from `dev`
- Use `yourname/feature-description` for branch names
- All PRs require at least 1 peer review
- Frontend team: stay in `frontend/`, Backend team: stay in `backend/`

## 👥 Team

Built with ❤️ by the CoursePilot team at USC
