from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session
from backend import database as db
from backend.schema import (
    UserInDB,
    UserRegistrationRequest, # Request Model
    UserResponse,
)
from backend.routers.auth import get_current_user

users_router = APIRouter(prefix="/users", tags=["Users"])

user_dependency = Annotated[dict, Depends(get_current_user)]
db_dependency = Annotated[Session, Depends(db.get_session)]

class EntityNotFoundException(Exception):
    def __init__(self, *, entity_name: str, entity_id: str):
        self.entity_name = entity_name
        self.entity_id = entity_id

# ------------------------------------- #
#              CREATE                   #
# ------------------------------------- #


# ------------------------------------- #
#              READ                     #
# ------------------------------------- #
# @users_router.get("/{user_id}", response_model=UserResponse)
# def get_user(*, session: db_dependency, user_id: int):
#     """Get user by id"""
#     user = session.get(UserInDB, user_id)
#     if user:
#         return user
#     return EntityNotFoundException(entity_name="User", entity_id=user_id)

@users_router.get("/self", response_model=UserInDB)
def get_self(user: user_dependency):
    
    return { 'User': user }

    

# ------------------------------------- #
#              UPDATE                   #
# ------------------------------------- #


# ------------------------------------- #
#              DELETE                   #
# ------------------------------------- #


