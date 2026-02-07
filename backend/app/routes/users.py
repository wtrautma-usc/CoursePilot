from fastapi import APIRouter, Depends

from app.dependencies import get_current_user
from app.firebase import auth_client, db
from app.models.schemas import UserResponse, UserUpdate

router = APIRouter(prefix="/api/v1/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    """
    Get the current authenticated user's profile.
    """
    return current_user


@router.patch("/me", response_model=UserResponse)
async def update_me(
    updates: UserUpdate,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Update the current authenticated user's profile.
    Only provided fields will be updated.
    """
    # Build update dict with only non-None values
    update_data = updates.model_dump(exclude_none=True)

    # Convert nested preferences to dict for Firestore
    if "preferences" in update_data:
        update_data["preferences"] = updates.preferences.model_dump()

    if update_data:
        user_ref = db.collection("users").document(current_user.uid)
        user_ref.update(update_data)

        # Fetch updated document
        updated_doc = user_ref.get()
        return UserResponse(**updated_doc.to_dict())

    return current_user


@router.delete("/me", status_code=204)
async def delete_me(current_user: UserResponse = Depends(get_current_user)):
    """
    Delete the current user's account.
    Removes both Firestore document and Firebase Auth user.
    """
    # Delete Firestore document
    db.collection("users").document(current_user.uid).delete()

    # Delete Firebase Auth user
    auth_client.delete_user(current_user.uid)

    return None
