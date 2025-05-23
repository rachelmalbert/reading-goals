from collections import defaultdict
from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.routers.auth import get_current_user
from app import database as db
from app.schema import (
        UserInDB,
        SessionRequest
        )

sessions_router = APIRouter(prefix="/sessions", tags=["Sessions"])

user_dependency = Annotated[UserInDB, Depends(get_current_user)]
db_dependency = Annotated[Session, Depends(db.get_session)]

# ------------------------------------- #
#              CREATE                   #
# ------------------------------------- #
@sessions_router.post("/add")
def add_session(session: db_dependency, user: user_dependency, new_session: SessionRequest):
    """Add a reading session"""
    return db.add_session(session, user.id, new_session)

# ------------------------------------- #
#              READ                     #
# ------------------------------------- #
@sessions_router.get("")
def get_sessions(session: db_dependency, user: user_dependency):
       """Get all user reading sessions in the form {date: [sessions]}"""
       sessions = db.get_sessions(session, user.id)
       sessions_by_date = defaultdict(list)
       for session in sessions:
        session_date = session.created_at
        sessions_by_date[session_date].append(session)
       return sessions_by_date
    #    sessions = db.get_sessions_by_date(session, user.id)
    #    return sessions

# ------------------------------------- #
#              DELETE                   #
# ------------------------------------- #


