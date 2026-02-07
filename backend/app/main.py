"""
CoursePilot API Main Application Module.

This module initializes the FastAPI application with CORS middleware,
health checks, and routing configuration for the CoursePilot student dashboard.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI application
app = FastAPI(
    title="CoursePilot API",
    description="AI-powered student dashboard for course management",
    version="0.1.0",
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TODO: Import routers as they are created
# Example:
# from app.routes import courses, syllabi, assignments
# app.include_router(courses.router)
# app.include_router(syllabi.router)
# app.include_router(assignments.router)


@app.get("/")
async def root() -> dict[str, str]:
    """
    Root endpoint providing API information.

    Returns:
        dict: API status and version information
    """
    return {"message": "CoursePilot API", "status": "running", "version": "0.1.0"}


@app.get("/health")
async def health_check() -> dict[str, str]:
    """
    Health check endpoint for monitoring and load balancer probes.

    Returns:
        dict: Health status of the API
    """
    return {"status": "ok"}
