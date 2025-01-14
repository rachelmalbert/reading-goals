from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app import database as db
from app.schema import (
    UserInDB,
    BookInDB
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

@user_router.delete("/delete/{book_id}", response_model=list[BookInDB])
def checkin_book(session: db_dependency, user: user_dependency, book_id: str):
        """Deletes book with book_id from user library"""
        db.delete_book(session, user.id, book_id)
        return user.books
