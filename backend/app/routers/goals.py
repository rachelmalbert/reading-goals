
from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.routers.auth import get_current_user
from app import database as db
from app.schema import (
        GoalInDB,
        UserInDB,
        GoalRequest
        )

goals_router = APIRouter(prefix="/goals", tags=["Goals"])

user_dependency = Annotated[UserInDB, Depends(get_current_user)]
db_dependency = Annotated[Session, Depends(db.get_session)]

# ------------------------------------- #
#              READ                     #
# ------------------------------------- #

@goals_router.get("")
def get_goals(user: user_dependency):
    """Get user goals"""
    return user.goals

@goals_router.get("/progress/{goal_id}")
def get_goal_progress(session: db_dependency,  user: user_dependency, goal_id: int):
        progress = db.get_goal_progress(session, user.id, goal_id)
        return progress

# ------------------------------------- #
#              UPDATE                   #
# ------------------------------------- #

@goals_router.put("/update/{goal_id}", response_model=GoalInDB)
def update_goal(session: db_dependency, user: user_dependency, goal_id: int, goalUpdate: GoalRequest):
    """Create a new goal"""
    return db.update_goal(session, user, goal_id, goalUpdate)
