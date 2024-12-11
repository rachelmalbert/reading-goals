
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from backend.routers.auth import get_current_user
from backend import database as db
from backend.schema import (
        GoalInDB,
        UserInDB,
        GoalRequest
        )


goals_router = APIRouter(prefix="/goals", tags=["Goals"])

user_dependency = Annotated[UserInDB, Depends(get_current_user)]
db_dependency = Annotated[Session, Depends(db.get_session)]

# ------------------------------------- #
#              CREATE                   #
# ------------------------------------- #
# @goals_router.post("/add", response_model=GoalInDB)
# def add_goal(session: db_dependency, user: user_dependency, period: str, type: str, amount: int, books_per_year: int):
#     """Create a new goal"""
#     return db.add_goal(session, user, period, type, amount, books_per_year)

@goals_router.post("/add", response_model=GoalInDB)
def add_goal(session: db_dependency, user: user_dependency, goal: GoalRequest):
    """Create a new goal"""
    return db.add_goal(session, user, goal)


# ------------------------------------- #
#              READ                     #
# ------------------------------------- #
@goals_router.get("", response_model=list[GoalInDB])
def get_goal(user: user_dependency):
    """Get user goal"""
    if user.goals:
        return user.goals
    else:
        raise HTTPException(status_code=404, detail="User has not set any goals yet")

@goals_router.get("/{period}", response_model=GoalInDB)
def get_goal(session: db_dependency,  user: user_dependency, period: str):
    """Get user's daily goal"""
    return db.get_goal(session, user.id, period)

@goals_router.get("/progress/{type}/{period}")
def get_goal_progress(session: db_dependency, user: user_dependency, type: str, period: str):
  
        progress = db.get_goal_progress(session, user.id, type, period)
        return progress


# ------------------------------------- #
#              UPDATE                   #
# ------------------------------------- #
@goals_router.put("/update/goal", response_model=GoalInDB)
def update_goal(session: db_dependency, user: user_dependency, period: str, type: str, amount: int, books_per_year: int):
    """Create a new goal"""
    return db.update_goal(session, user, period, type, amount, books_per_year)


# ------------------------------------- #
#              DELETE                   #
# ------------------------------------- #