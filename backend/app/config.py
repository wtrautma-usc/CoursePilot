"""
CoursePilot Configuration Module.

This module manages application configuration using environment variables.
Configuration is loaded from .env file and provides settings for Firebase,
Redis, and general application environment.
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
    """
    Application settings and configuration.

    This class centralizes all configuration values loaded from environment
    variables. It provides default values for development and can be customized
    via .env file for different environments.

    Attributes:
        FIREBASE_CREDENTIALS_PATH: Path to Firebase Admin SDK credentials JSON file
        FIREBASE_STORAGE_BUCKET: Firebase Storage bucket name for file storage
        REDIS_URL: Redis connection URL for Celery broker and result backend
        ENVIRONMENT: Current environment (development, staging, production)
    """

    FIREBASE_CREDENTIALS_PATH: str = os.getenv("FIREBASE_CREDENTIALS_PATH", "")
    FIREBASE_STORAGE_BUCKET: str = os.getenv("FIREBASE_STORAGE_BUCKET", "")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")


# Global settings instance
settings = Settings()
