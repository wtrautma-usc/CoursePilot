"""
Syllabus Processing Celery Task.

This module contains the background task for processing uploaded syllabus PDFs.
The pipeline:
    1. User uploads PDF via /api/v1/syllabi/upload (status: "pending")
    2. Celery task picks up the job (status: "processing")
    3. AI parses the PDF and extracts calendar events
    4. Events are saved to Firestore for user review (status: "pending_review")
    5. If anything fails, the syllabus is marked (status: "failed")

Usage:
    from app.tasks.syllabus_processing import process_syllabus

    # Trigger asynchronously
    result = process_syllabus.delay(syllabus_id)
    job_id = result.id  # Use this to poll /api/v1/jobs/{job_id}/status
"""

from datetime import datetime

from celery_app import celery_app
from app.firebase import db


@celery_app.task(bind=True, name="process_syllabus")
def process_syllabus(self, syllabus_id: str) -> dict:
    """
    Process an uploaded syllabus PDF and extract calendar events.

    This task runs asynchronously via Celery. It reads the syllabus PDF
    from Firebase Storage, uses AI to extract course events (assignments,
    exams, quizzes, etc.), and stores them in Firestore for user review.

    Args:
        self: Celery task instance (bound task).
        syllabus_id: The unique ID of the syllabus document in Firestore.

    Returns:
        dict: Result with status and syllabus_id.
              Example: {"status": "pending_review", "syllabus_id": "abc-123"}

    Raises:
        Exception: Re-raises any exception after marking the syllabus as failed.
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

        # ── Step 4: Mark as pending review ───────────────────────────
        syllabus_ref.update({
            "status": "pending_review",
            "processed_at": datetime.utcnow(),
        })

        return {"status": "pending_review", "syllabus_id": syllabus_id}

    except Exception as exc:
        # ── Mark as failed and record error ──────────────────────────
        syllabus_ref.update({
            "status": "failed",
            "error_message": str(exc),
            "processed_at": datetime.utcnow(),
        })
        raise
