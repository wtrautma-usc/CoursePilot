from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


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
