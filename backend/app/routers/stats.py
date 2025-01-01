from datetime import datetime
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

# @stats_router.get("/month")
# def get_monthly_stats(session: db_dependency, user: user_dependency):
#     """Get monthly stats for user"""
#     stats = db.get_monthly_stats(session, user.id)
#     return stats


# @stats_router.get("/yearly")
# def get_yearly_stats(session: db_dependency, user: user_dependency,  year: int = datetime.now().year):
#     """Get stats for user"""
#     stats = db.get_yearly_stats(session, user.id, year)
#     # {pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], minutes: []}
#     return stats

@stats_router.get("/{period}")
def get_stats(session: db_dependency, user: user_dependency, period: str):
    """Get  stats for user"""
    # date = datetime.now()
    chartData = db.get_chart_data(session, user.id, period)
    return chartData
