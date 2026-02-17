from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr


# ============================================
# User-related schemas
# ============================================


class NotificationTiming(BaseModel):
    one_week_before: bool = True
    three_days_before: bool = True
    twenty_four_hours_before: bool = True
    same_day: bool = False


class NotificationPreferences(BaseModel):
    email_enabled: bool = True
    sms_enabled: bool = False
    push_enabled: bool = True
    timing: NotificationTiming = NotificationTiming()


class UserPreferences(BaseModel):
    notifications: NotificationPreferences = NotificationPreferences()
    theme: str = "light"
    calendar_start_day: str = "Sunday"


class UserResponse(BaseModel):
    uid: str
    email: EmailStr
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    phone_number: Optional[str] = None
    created_at: datetime
    preferences: UserPreferences = UserPreferences()
    is_onboarded: bool = False


class UserUpdate(BaseModel):
    """Fields that can be updated via PATCH /users/me"""
    display_name: Optional[str] = None
    phone_number: Optional[str] = None
    preferences: Optional[UserPreferences] = None
    is_onboarded: Optional[bool] = None


# ============================================
# Syllabus-related schemas
# ============================================


class SyllabusUploadResponse(BaseModel):
    """Response model for syllabus upload"""
    syllabus_id: str
    job_id: str
    filename: str
    file_url: str
    status: str
    uploaded_at: datetime
    message: str


class SyllabusMetadata(BaseModel):
    """Metadata stored in Firestore for each syllabus"""
    syllabus_id: str
    user_id: str
    filename: str
    file_url: str
    file_size: int
    content_type: str
    status: str  # "pending", "processing", "completed", "failed"
    uploaded_at: datetime
    processed_at: Optional[datetime] = None
    error_message: Optional[str] = None


# ============================================
# Event-related schemas (with grading_weight and sub_tasks)
# ============================================


class EventResponse(BaseModel):
    """Response model for calendar events extracted from syllabi"""
    event_id: str
    syllabus_id: str
    user_id: str
    course_name: str
    event_type: str  # "assignment", "exam", "quiz", "project", etc.
    title: str
    description: Optional[str] = None
    date: datetime
    due_time: Optional[str] = None
    location: Optional[str] = None
    
    # NEW FIELDS (Task 2.3.C)
    grading_weight: Optional[str] = None  # e.g., "20%", "200 points", "25% of final grade"
    sub_tasks: List[str] = []  # AI-generated checklist steps
    
    # Metadata
    page_number: Optional[int] = None  # Citation link to PDF page
    created_at: datetime
    is_confirmed: bool = False  # Human-in-the-loop confirmation


class EventCreate(BaseModel):
    """Schema for creating a new event"""
    course_name: str
    event_type: str
    title: str
    description: Optional[str] = None
    date: datetime
    due_time: Optional[str] = None
    location: Optional[str] = None
    grading_weight: Optional[str] = None
    sub_tasks: List[str] = []
    page_number: Optional[int] = None


class EventUpdate(BaseModel):
    """Schema for updating an event (human-in-the-loop review)"""
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    due_time: Optional[str] = None
    location: Optional[str] = None
    grading_weight: Optional[str] = None
    sub_tasks: Optional[List[str]] = None
    is_confirmed: Optional[bool] = None
