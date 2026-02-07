"""
CoursePilot Celery Application Module.

This module configures Celery for asynchronous task processing in CoursePilot.
Celery is used for background tasks such as PDF processing, AI analysis,
and other time-consuming operations that shouldn't block API responses.

Usage:
    Start a Celery worker:
        celery -A celery_app worker --loglevel=info

    Monitor tasks:
        celery -A celery_app flower

    Create a task in app/tasks/:
        from celery_app import celery_app

        @celery_app.task
        def process_syllabus(file_path: str) -> dict:
            # Task implementation
            return {"status": "completed"}
"""

from celery import Celery
from app.config import settings

# Initialize Celery application
celery_app = Celery(
    "coursepilot", broker=settings.REDIS_URL, backend=settings.REDIS_URL
)

# Configure Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# Auto-discover tasks from app.tasks module
celery_app.autodiscover_tasks(["app.tasks"])
