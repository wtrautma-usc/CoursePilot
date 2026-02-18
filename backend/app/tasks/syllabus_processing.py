"""
Syllabus Processing Background Task.

This module contains the background task for processing uploaded syllabus PDFs.
Uses FastAPI BackgroundTasks instead of Celery to avoid the cost of a
separate worker process and Redis broker on Render.

The pipeline:
    1. User uploads PDF via /api/v1/syllabi/upload (status: "pending")
    2. BackgroundTask starts processing (status: "processing")
    3. AI parses the PDF and extracts calendar events
    4. Events are saved to Firestore for user review (status: "completed")
    5. If anything fails, the syllabus is marked (status: "failed")

Frontend polls GET /api/v1/syllabi/{syllabus_id} to check status.

Usage:
    from fastapi import BackgroundTasks
    from app.tasks.syllabus_processing import process_syllabus

    @router.post("/upload")
    async def upload(background_tasks: BackgroundTasks):
        background_tasks.add_task(process_syllabus, syllabus_id)
"""

import time
from datetime import datetime

from app.firebase import db


def process_syllabus(syllabus_id: str) -> None:
    """
    Process an uploaded syllabus PDF and extract calendar events.

    This function runs in the background via FastAPI BackgroundTasks.
    It reads the syllabus PDF from Firebase Storage, uses AI to extract
    course events (assignments, exams, quizzes, etc.), and stores them
    in Firestore for user review.

    Args:
        syllabus_id: The unique ID of the syllabus document in Firestore.
    """
    syllabus_ref = db.collection("syllabi").document(syllabus_id)

    try:
        # ── Step 1: Mark syllabus as processing ──────────────────────
        syllabus_ref.update({"status": "processing"})

        # ── Step 2: Fetch syllabus metadata ──────────────────────────
        syllabus_doc = syllabus_ref.get()
        if not syllabus_doc.exists:
            raise ValueError(f"Syllabus {syllabus_id} not found in Firestore")

        # TODO: Download PDF from Firebase Storage using syllabus metadata
        # syllabus_data = syllabus_doc.to_dict()
        # file_url = syllabus_data["file_url"]

        # ── Step 3: AI parsing ───────────────────────────────────────
        # TODO: Integrate AI service to parse PDF and extract events
        # - Extract course name, instructor, schedule
        # - Identify assignments, exams, quizzes, projects with dates
        # - Extract grading weights and generate sub-task checklists
        # - Save extracted events to Firestore "events" collection

        # Simulate processing time (remove when AI integration is added)
        time.sleep(5)

        # ── Step 4: Mark as completed ────────────────────────────────
        syllabus_ref.update({
            "status": "completed",
            "processed_at": datetime.utcnow(),
        })

    except Exception as exc:
        # ── Mark as failed and record error ──────────────────────────
        syllabus_ref.update({
            "status": "failed",
            "error_message": str(exc),
            "processed_at": datetime.utcnow(),
        })
