"""
Job Status Polling Routes.

This module provides endpoints for checking the status of background
Celery tasks (e.g., syllabus PDF processing).

Typical flow:
    1. Client uploads a syllabus → receives a job_id (Celery task ID)
    2. Client polls GET /api/v1/jobs/{job_id}/status
    3. Response includes current state: PENDING, STARTED, SUCCESS, or FAILURE
    4. On SUCCESS, result contains the task return value
    5. On FAILURE, error contains the exception message
"""

from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException
from celery.result import AsyncResult

from celery_app import celery_app
from app.dependencies import get_current_user
from app.models.schemas import UserResponse

router = APIRouter(prefix="/api/v1/jobs", tags=["jobs"])


@router.get("/{job_id}/status")
async def get_job_status(
    job_id: str,
    current_user: UserResponse = Depends(get_current_user),
) -> dict[str, Any]:
    """
    Get the status of a background processing job.

    Polls the Celery result backend for the current state of a task.
    Celery task states:
        - PENDING: Task is waiting to be picked up (or ID is unknown)
        - STARTED: Task has begun executing
        - SUCCESS: Task completed successfully
        - FAILURE: Task raised an exception

    Note:
        Celery returns PENDING for unknown job IDs. There is no way to
        distinguish between a queued task and a non-existent one via
        Celery alone.

    Args:
        job_id: The Celery task ID returned when the job was created.
        current_user: Authenticated user (Firebase JWT required).

    Returns:
        dict with job_id, status, result (if completed), and error (if failed).
    """
    result = AsyncResult(job_id, app=celery_app)

    response: dict[str, Any] = {
        "job_id": job_id,
        "status": result.status,
        "result": None,
        "error": None,
    }

    if result.state == "SUCCESS":
        response["result"] = result.result
    elif result.state == "FAILURE":
        response["error"] = str(result.result)

    return response
