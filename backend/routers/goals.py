from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session
from backend import database as db

from backend.routers.auth import get_current_user

goals_router = APIRouter(prefix="/goals", tags=["Goals"])

user_dependency = Annotated[dict, Depends(get_current_user)]
db_dependency = Annotated[Session, Depends(db.get_session)]

@goals_router.get("")
def get_goals(session: db_dependency, user: user_dependency):
    """Get all user goals"""
    pass

@goals_router.post("/add")
def get_goals(session: db_dependency, user: user_dependency):
    """Create a new book goal"""

