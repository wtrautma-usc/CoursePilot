"""
Gamification Routes.

Handles UserStats creation, retrieval, and XP awarding.

Firestore layout:
    user_stats/{uid}   →  UserStats document

XP Actions (defined in schemas.XP_TABLE):
    syllabus_upload   → 100 XP
    event_confirmed   →  15 XP
    task_complete     →  10 XP
    deadline_bonus    → 150 XP
    daily_streak      →  20 XP  (awarded automatically on award_xp when streak active)
"""

from datetime import date, timedelta
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.dependencies import get_current_user
from app.firebase import db
from app.models.schemas import (
    LEVEL_THRESHOLDS,
    XP_TABLE,
    UserStats,
    UserStatsResponse,
    UserResponse,
    compute_level,
)

router = APIRouter(prefix="/api/v1/users/me", tags=["gamification"])

# Valid action types the frontend can send
ActionType = Literal[
    "syllabus_upload",
    "event_confirmed",
    "task_complete",
    "deadline_bonus",
]


class AwardXPRequest(BaseModel):
    action: ActionType


class AwardXPResponse(BaseModel):
    xp_earned: int           # XP awarded for this specific action
    streak_bonus_xp: int     # extra XP for keeping streak alive (0 if no change)
    leveled_up: bool         # did the user cross a level threshold?
    new_level_name: str      # current level name after update
    stats: UserStatsResponse  # full updated stats


def _build_response(stats: UserStats) -> UserStatsResponse:
    """Attach computed level fields to a UserStats object."""
    level_number, level_name = compute_level(stats.total_xp)

    # XP needed for next level (None if already at max)
    next_threshold = None
    if level_number + 1 < len(LEVEL_THRESHOLDS):
        next_threshold = LEVEL_THRESHOLDS[level_number + 1][0] - stats.total_xp

    return UserStatsResponse(
        **stats.model_dump(),
        level=level_number,
        level_name=level_name,
        xp_to_next_level=next_threshold,
    )


def _get_or_create_stats(uid: str) -> UserStats:
    """
    Fetch UserStats from Firestore.
    Auto-creates a default document if this is the user's first visit.
    Mirrors the same auto-create pattern used in dependencies.py for users.
    """
    ref = db.collection("user_stats").document(uid)
    doc = ref.get()

    if doc.exists:
        data = doc.to_dict()
        # Firestore stores dates as strings — coerce back to date
        if isinstance(data.get("last_activity_date"), str):
            data["last_activity_date"] = date.fromisoformat(data["last_activity_date"])
        return UserStats(**data)

    # First time — initialise with defaults
    default = UserStats(uid=uid)
    ref.set(default.model_dump())
    return default


def _update_streak(stats: UserStats) -> tuple[UserStats, int]:
    """
    Recalculate streak based on last_activity_date and today.

    Rules:
        - Same day activity   → streak unchanged (already counted today)
        - Activity yesterday  → streak continues, +1
        - Activity 2+ days ago → streak resets to 1
        - No prior activity   → streak starts at 1

    Returns updated stats and streak bonus XP (20 if streak extended, else 0).
    """
    today = date.today()
    last = stats.last_activity_date
    streak_bonus = 0

    if last is None:
        # First ever activity
        stats.current_streak = 1
        streak_bonus = XP_TABLE["daily_streak"]
    elif last == today:
        # Already active today — no change
        pass
    elif last == today - timedelta(days=1):
        # Consecutive day — extend streak
        stats.current_streak += 1
        streak_bonus = XP_TABLE["daily_streak"]
    else:
        # Missed at least one day — reset
        stats.current_streak = 1
        streak_bonus = XP_TABLE["daily_streak"]

    stats.last_activity_date = today
    return stats, streak_bonus


@router.get("/stats", response_model=UserStatsResponse)
async def get_my_stats(
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Get the current user's gamification stats.

    Returns streak, XP, level (derived), and XP needed for next level.
    Auto-creates a zeroed-out stats document on first request.
    """
    stats = _get_or_create_stats(current_user.uid)
    return _build_response(stats)


@router.post("/stats/award-xp", response_model=AwardXPResponse)
async def award_xp(
    body: AwardXPRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Award XP to the current user for a completed action.

    Called by the frontend whenever a user does something meaningful:
        - uploads a syllabus
        - confirms an AI-extracted event
        - checks off a study sub-task
        - completes all tasks before a deadline

    Automatically:
        - adds action XP
        - updates streak and awards streak bonus XP if applicable
        - checks for level-up
        - persists everything to Firestore atomically
    """
    stats = _get_or_create_stats(current_user.uid)

    # Snapshot level before changes to detect level-up
    old_level, _ = compute_level(stats.total_xp)

    # Award XP for the action
    action_xp = XP_TABLE[body.action]
    stats.total_xp += action_xp

    # Update streak and get streak bonus
    stats, streak_bonus = _update_streak(stats)
    stats.total_xp += streak_bonus

    # Check for level-up
    new_level, new_level_name = compute_level(stats.total_xp)
    leveled_up = new_level > old_level

    # Persist to Firestore
    db.collection("user_stats").document(current_user.uid).set({
        "uid": current_user.uid,
        "current_streak": stats.current_streak,
        "total_xp": stats.total_xp,
        "last_activity_date": stats.last_activity_date.isoformat() if stats.last_activity_date else None,
    })

    return AwardXPResponse(
        xp_earned=action_xp,
        streak_bonus_xp=streak_bonus,
        leveled_up=leveled_up,
        new_level_name=new_level_name,
        stats=_build_response(stats),
    )
