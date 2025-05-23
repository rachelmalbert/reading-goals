from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app import database as db
from app.schema import (
    UserInDB,
)
from app.routers.auth import get_current_user

user_router = APIRouter(prefix="/user", tags=["User"])

user_dependency = Annotated[UserInDB, Depends(get_current_user)]
db_dependency = Annotated[Session, Depends(db.get_session)]

# ------------------------------------- #
#              READ                     #
# ------------------------------------- #

@user_router.get("/self", response_model=UserInDB)
def get_self(user: user_dependency):
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user   

# ------------------------------------- #
#              DELETE                   #
# ------------------------------------- #

