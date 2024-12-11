from datetime import date
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from backend import database as db

from backend.routers.auth import get_current_user
from backend.schema import (
    UserInDB,
    GoalInDB,
    TotalStatsResponse,
    SessionRequest
    )

dashboard_router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

user_dependency = Annotated[UserInDB, Depends(get_current_user)]
db_dependency = Annotated[Session, Depends(db.get_session)]


# ------------------------------------- #
#              CREATE                   #
# ------------------------------------- #
# @dashboard_router.post("/add/goal", response_model=GoalInDB)
# def add_goal(session: db_dependency, user: user_dependency, period: str, type: str, amount: int, books_per_year: int):
#     """Create a new goal"""
#     return db.add_goal(session, user, period, type, amount, books_per_year)

# @dashboard_router.post("/add/session")
# def add_session(session: db_dependency, user: user_dependency, new_session: SessionRequest):
#     """Add a reading session"""
#     return db.add_session(session, user.id, new_session)


# ------------------------------------- #
#              READ                     #
# ------------------------------------- #
# @dashboard_router.get("", response_model=GoalInDB)
# def get_goal(user: user_dependency):
#     """Get user goal"""
#     if user.goal:
#         return user.goal
#     else:
#         raise HTTPException(status_code=404, detail="User has not set any goals yet")

# @dashboard_router.get("/stats", response_model= TotalStatsResponse)
# def get_total_stats(session: db_dependency, user: user_dependency):
#     """Get total stats for user"""
#     stats = db.get_total_stats(session, user.id)
#     return stats
# ------------------------------------- #
#              UPDATE                   #
# ------------------------------------- #
# @dashboard_router.put("/update/goal", response_model=GoalInDB)
# def update_goal(session: db_dependency, user: user_dependency, period: str, type: str, amount: int, books_per_year: int):
#     """Create a new goal"""
#     return db.update_goal(session, user, period, type, amount, books_per_year)

# @dashboard_router.put("/update/stat")
# def update_stats(session: db_dependency, user: user_dependency, update_stats: UpdateStatsRequest):
#     """Update daily stat for user and book stat for book with book_id"""
#     # return db.update_stats(session, user.id, update_stats.book_id, update_stats.y_m_d, update_stats.cur_page, update_stats.minutes)
#     return db.update_stats(session, user.id, update_stats)


# ------------------------------------- #
#              DELETE                   #
# ------------------------------------- #


  



        


