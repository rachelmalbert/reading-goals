from datetime import datetime
import os
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import ExpiredSignatureError, JWTError, jwt
from passlib.context import CryptContext
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlmodel import Session, select
import app.database as db
from app.schema import(
    UserInDB,
    UserRegistrationRequest,
    GoalInDB
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
@auth_router.post("/register")
def create_user(*, session: db_dependency, registration: UserRegistrationRequest):
    """Register a new user"""

    new_user = UserInDB(
        **registration.model_dump(),
        hashed_password=pwd_context.hash(registration.password),
    )
    query = select(UserInDB).where(UserInDB.username==new_user.username)
    user = session.exec(query).first()
    if (user):
        raise HTTPException(status_code=409, detail="Username already taken")
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    daily_goal = GoalInDB(user_id=new_user.id, type="minutes", period="day", amount="25")
    yearly_goal = GoalInDB(user_id=new_user.id, type="books", period="year", amount="12")
    session.add(daily_goal)
    session.add(yearly_goal)

    session.commit()
    session.refresh(daily_goal)
    session.refresh(yearly_goal)
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
    user = session.exec(select(UserInDB).where(UserInDB.username == form.username)).first()

    if not user:
        return False 
    if not pwd_context.verify(form.password, user.hashed_password): 
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
        user = session.get(UserInDB, user_id)
        return  user
    except JWTError:
        raise HTTPException(status_code=401, detail="JWTError")
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="expired signature")
    