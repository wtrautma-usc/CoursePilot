"""
Syllabus Upload and Management Routes.

This module handles PDF syllabus uploads, storage, and metadata management.
"""

from datetime import datetime
from typing import Annotated
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.dependencies import get_current_user
from app.firebase import db, storage_bucket
from app.models.schemas import SyllabusMetadata, SyllabusUploadResponse, UserResponse

router = APIRouter(prefix="/api/v1/syllabi", tags=["syllabi"])

# Allowed file types
ALLOWED_CONTENT_TYPES = ["application/pdf"]
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/upload", response_model=SyllabusUploadResponse, status_code=201)
async def upload_syllabus(
    file: Annotated[UploadFile, File(description="PDF syllabus file to upload")],
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Upload a syllabus PDF file.
    
    This endpoint:
    1. Validates the file is a PDF and within size limits
    2. Uploads the file to Firebase Storage
    3. Saves metadata to Firestore
    4. Triggers background processing (Celery task)
    
    Args:
        file: PDF file to upload
        current_user: Authenticated user from JWT token
        
    Returns:
        SyllabusUploadResponse: Upload confirmation with file details
        
    Raises:
        HTTPException: If file validation fails or upload errors occur
    """
    # Validate file type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Only PDF files are allowed. Got: {file.content_type}",
        )
    
    # Read file content
    file_content = await file.read()
    file_size = len(file_content)
    
    # Validate file size
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE / 1024 / 1024} MB",
        )
    
    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty",
        )
    
    try:
        # Generate unique syllabus ID
        syllabus_id = str(uuid.uuid4())
        
        # Create storage path: syllabi/{user_id}/{syllabus_id}/{filename}
        storage_path = f"syllabi/{current_user.uid}/{syllabus_id}/{file.filename}"
        
        # Upload to Firebase Storage
        blob = storage_bucket.blob(storage_path)
        blob.upload_from_string(file_content, content_type=file.content_type)
        
        # Make the file publicly accessible (optional - adjust based on security requirements)
        # blob.make_public()
        
        # Get the file URL (you may want to generate a signed URL instead)
        file_url = blob.public_url if blob.public_url else f"gs://{storage_bucket.name}/{storage_path}"
        
        # Create metadata object
        uploaded_at = datetime.utcnow()
        metadata = SyllabusMetadata(
            syllabus_id=syllabus_id,
            user_id=current_user.uid,
            filename=file.filename,
            file_url=file_url,
            file_size=file_size,
            content_type=file.content_type,
            status="pending",
            uploaded_at=uploaded_at,
        )
        
        # Save metadata to Firestore
        db.collection("syllabi").document(syllabus_id).set(metadata.model_dump())
        
        # Trigger Celery task for PDF processing
        from app.tasks.syllabus_processing import process_syllabus
        result = process_syllabus.delay(syllabus_id)

        # Return success response
        return SyllabusUploadResponse(
            syllabus_id=syllabus_id,
            job_id=result.id,
            filename=file.filename,
            file_url=file_url,
            status="pending",
            uploaded_at=uploaded_at,
            message="Syllabus uploaded successfully. Processing will begin shortly.",
        )
        
    except Exception as e:
        # Log the error (in production, use proper logging)
        print(f"Error uploading syllabus: {str(e)}")
        
        # Clean up: attempt to delete the file from storage if it was uploaded
        try:
            if 'blob' in locals():
                blob.delete()
        except Exception:
            pass
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload syllabus: {str(e)}",
        )


@router.get("/me", response_model=list[SyllabusMetadata])
async def get_my_syllabi(current_user: UserResponse = Depends(get_current_user)):
    """
    Get all syllabi uploaded by the current user.
    
    Returns:
        List of syllabus metadata for the authenticated user
    """
    syllabi_ref = db.collection("syllabi").where("user_id", "==", current_user.uid)
    syllabi_docs = syllabi_ref.stream()
    
    syllabi = [SyllabusMetadata(**doc.to_dict()) for doc in syllabi_docs]
    
    # Sort by upload date (most recent first)
    syllabi.sort(key=lambda x: x.uploaded_at, reverse=True)
    
    return syllabi


@router.get("/{syllabus_id}", response_model=SyllabusMetadata)
async def get_syllabus(
    syllabus_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Get details of a specific syllabus.
    
    Args:
        syllabus_id: ID of the syllabus to retrieve
        current_user: Authenticated user
        
    Returns:
        Syllabus metadata
        
    Raises:
        HTTPException: If syllabus not found or user doesn't have access
    """
    syllabus_doc = db.collection("syllabi").document(syllabus_id).get()
    
    if not syllabus_doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Syllabus not found",
        )
    
    syllabus = SyllabusMetadata(**syllabus_doc.to_dict())
    
    # Verify user owns this syllabus
    if syllabus.user_id != current_user.uid:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access this syllabus",
        )
    
    return syllabus


@router.delete("/{syllabus_id}", status_code=204)
async def delete_syllabus(
    syllabus_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Delete a syllabus and all associated data.
    
    Args:
        syllabus_id: ID of the syllabus to delete
        current_user: Authenticated user
        
    Raises:
        HTTPException: If syllabus not found or user doesn't have access
    """
    syllabus_doc = db.collection("syllabi").document(syllabus_id).get()
    
    if not syllabus_doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Syllabus not found",
        )
    
    syllabus = SyllabusMetadata(**syllabus_doc.to_dict())
    
    # Verify user owns this syllabus
    if syllabus.user_id != current_user.uid:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this syllabus",
        )
    
    try:
        # Delete file from storage
        storage_path = f"syllabi/{current_user.uid}/{syllabus_id}/"
        blobs = storage_bucket.list_blobs(prefix=storage_path)
        for blob in blobs:
            blob.delete()
        
        # Delete Firestore document
        db.collection("syllabi").document(syllabus_id).delete()
        
        # TODO: Delete associated events
        # events_ref = db.collection("events").where("syllabus_id", "==", syllabus_id)
        # for event_doc in events_ref.stream():
        #     event_doc.reference.delete()
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete syllabus: {str(e)}",
        )
    
    return None
