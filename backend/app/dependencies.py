from datetime import datetime

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.firebase import auth_client, db
from app.models.schemas import UserResponse

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> UserResponse:
    """
    Validate Firebase JWT token and return user data.
    Creates user document in Firestore if it doesn't exist.
    """
    token = credentials.credentials

    try:
        # Verify the token with Firebase
        decoded_token = auth_client.verify_id_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    uid = decoded_token["uid"]
    email = decoded_token.get("email", "")

    # Check if user exists in Firestore
    user_ref = db.collection("users").document(uid)
    user_doc = user_ref.get()

    if user_doc.exists:
        user_data = user_doc.to_dict()
    else:
        # Create new user document
        user_data = {
            "uid": uid,
            "email": email,
            "display_name": decoded_token.get("name"),
            "photo_url": decoded_token.get("picture"),
            "phone_number": None,
            "created_at": datetime.utcnow(),
            "preferences": {
                "notifications": {
                    "email_enabled": True,
                    "sms_enabled": False,
                    "push_enabled": True,
                    "timing": {
                        "one_week_before": True,
                        "three_days_before": True,
                        "twenty_four_hours_before": True,
                        "same_day": False,
                    },
                },
                "theme": "light",
                "calendar_start_day": "Sunday",
            },
            "is_onboarded": False,
        }
        user_ref.set(user_data)

    return UserResponse(**user_data)
