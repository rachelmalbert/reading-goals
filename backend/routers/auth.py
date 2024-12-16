from datetime import datetime
import os
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt
from passlib.context import CryptContext
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlmodel import SQLModel, Session, select
from backend import database as db
from backend.schema import(
    UserInDB,
    UserRegistrationRequest,
    User
)


auth_router = APIRouter(prefix="/auth", tags=["Authentication"])

#TODO: store key in os environment
JWT_KEY = os.environ.get("JWT_KEY", default="insecure-jwt-key-for-dev")
JWT_ALG = "HS256"
JWT_DURATION = 3600

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

db_dependency = Annotated[Session, Depends(db.get_session)]


class AccessTokenResponse(BaseModel):
    """Response model for access token."""

    access_token: str
    token_type: str


# ------------------------------------- #
#              CREATE                   #
# ------------------------------------- #
#TODO: add response model that doesn't include sensitive info
@auth_router.post("/register")
def create_user(*, session: db_dependency, registration: UserRegistrationRequest):
    """Register a new user"""

    #TODO: set hashed_password to actual hashed password
    new_user = UserInDB(
        **registration.model_dump(),
        hashed_password=pwd_context.hash(registration.password),
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user

@auth_router.post("/token", response_model=AccessTokenResponse)
def get_access_token(*, session: db_dependency, form: OAuth2PasswordRequestForm = Depends()):
    """Get access token for the user"""

    # Authenticate the user, return false if user can not be authenticated
    user = authenticate_user(session, form)
    if not user:
        raise HTTPException(status_code=401, detail="username or password is incorrect")
    
    # If user is authenticated, generate JWT access token
    token = create_access_token(user)
    return AccessTokenResponse(
        access_token=token,
        token_type="Bearer"
    )

# ------------------------------------- #
#              Helpers                  #
# ------------------------------------- #

def authenticate_user(session: Session, form: OAuth2PasswordBearer):
    # Try to get the UserInDB based on the username from the form
    user = session.exec(select(UserInDB).where(UserInDB.username == form.username)).first()

    if not user: # user with the given username doesn't exist 
        return False 
    if not pwd_context.verify(form.password, user.hashed_password): # password is incorrect
        return False
    return user

def create_access_token(user: UserInDB):
    expires = int(datetime.now().timestamp()) + JWT_DURATION
    payload = {'sub' : user.username, 'id' : user.id, 'exp' : expires}
    return jwt.encode(payload, key=JWT_KEY, algorithm=JWT_ALG)

def get_current_user(session: db_dependency, token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = jwt.decode(token, key=JWT_KEY, algorithms=[JWT_ALG])
        username = payload.get('sub')
        user_id = payload.get('id')
        if username is None or user_id is None:
            raise HTTPException(status_code=401, detail="could not validate user")
        # return User(user_id=user_id, username=username)
        user = session.get(UserInDB, user_id)
        return  user
        # return {'username' : username, 'user_id' : user_id}
    except: pass
    # except JWTError:
    #     raise HTTPException(status_code=401, detail="JWTError")
    # except ExpiredSignatureError:
    #     raise HTTPException(status_code=401, detail="expired signature")
    
    
        

    



    

    


# Dependency example #
# def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
#     return {"q": q, "skip": skip, "limit": limit}

# @auth_router.get("/items/")
# def read_items(commons: Annotated[dict, Depends(common_parameters)]):
#     return commons

# @auth_router.get("/users/")
# def read_users(commons: Annotated[dict, Depends(common_parameters)]):
#     return commons