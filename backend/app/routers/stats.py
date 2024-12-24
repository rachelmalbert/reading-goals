from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.routers.auth import get_current_user
from app import database as db
from app.schema import (
        UserInDB,
        TotalStatsResponse
        )


stats_router = APIRouter(prefix="/stats", tags=["Stats"])

user_dependency = Annotated[UserInDB, Depends(get_current_user)]
db_dependency = Annotated[Session, Depends(db.get_session)]

# ------------------------------------- #
#              CREATE                   #
# ------------------------------------- #

# ------------------------------------- #
#              READ                     #
# ------------------------------------- #

@stats_router.get("", response_model= TotalStatsResponse)
def get_total_stats(session: db_dependency, user: user_dependency):
    """Get total stats for user"""
    stats = db.get_total_stats(session, user.id)
    return stats

@stats_router.get("/today")
def get_todays_stats(session: db_dependency, user: user_dependency):
    """Get todays stats for user"""
    stats = db.get_todays_stats(session, user.id)
    return stats

@stats_router.get("/month")
def get_monthly_stats(session: db_dependency, user: user_dependency):
    """Get monthly stats for user"""
    stats = db.get_monthly_stats(session, user.id)
    return stats