from typing import Annotated
from fastapi import APIRouter, Depends
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
#              READ                     #
# ------------------------------------- #

@stats_router.get("", response_model= TotalStatsResponse)
def get_total_stats(session: db_dependency, user: user_dependency):
    """Get total stats for user"""
    stats = db.get_total_stats(session, user.id)
    return stats

@stats_router.get("/{period}")
def get_stats(session: db_dependency, user: user_dependency, period: str):
    """Get  stats for user"""
    # date = datetime.now()
    chartData = db.get_chart_data(session, user.id, period)
    return chartData
