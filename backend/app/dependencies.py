"""
CoursePilot FastAPI Dependencies Module.

This module provides reusable dependency functions for FastAPI routes,
including authentication and authorization using Firebase Auth.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth

# HTTP Bearer token security scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """
    Dependency to verify Firebase Auth token and return user ID.

    This function extracts and verifies the Firebase ID token from the
    Authorization header, then returns the authenticated user's Firebase UID.
    Use this as a dependency in protected routes to ensure authentication.

    Args:
        credentials: HTTP Bearer token credentials from Authorization header

    Returns:
        str: The authenticated user's Firebase UID

    Raises:
        HTTPException: 401 if token is invalid or verification fails

    Usage in routes:
        @router.get("/protected")
        async def protected_route(user_id: str = Depends(get_current_user)):
            # user_id is the authenticated user's Firebase UID
            pass
    """
    try:
        # Verify the Firebase ID token
        decoded_token = auth.verify_id_token(credentials.credentials)

        # Extract the user ID from the decoded token
        user_id: str = decoded_token["uid"]

        return user_id

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
