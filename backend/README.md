# Backend

FastAPI + Python 3.11+ + Celery + Redis

## Setup

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Add your API keys
uvicorn app.main:app --reload
```

Runs at `http://localhost:8000`

## Celery Worker

```bash
redis-server  # Start Redis
celery -A celery_app worker --loglevel=info
```
