from datetime import datetime
from fastapi import APIRouter, Depends
from sqlmodel import Session
from backend import database as db
from backend.schema import (
    UserInDB,
    UserRegistration, # Request Model
    UserResponse,
)

users_router = APIRouter(prefix="/users", tags=["Users"])

# ------------------------------------- #
#              CREATE                   #
# ------------------------------------- #
@users_router.post("/register", response_model=UserResponse)
def create_user(*, session: Session = Depends(db.get_session), registration: UserRegistration):
    """Registers a new user"""

    #TODO: set hashed_password to actual hashed password
    user = UserInDB(
        **registration.model_dump(),
        hashed_password=registration.password,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


# ------------------------------------- #
#              READ                     #
# ------------------------------------- #

# ------------------------------------- #
#              UPDATE                   #
# ------------------------------------- #


# ------------------------------------- #
#              DELETE                   #
# ------------------------------------- #