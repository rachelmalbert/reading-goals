from contextlib import asynccontextmanager
from fastapi import FastAPI
from mangum import Mangum
from app.database import create_db_and_tables
from app.routers.books import books_router
from app.routers.user import user_router
from app.routers.auth import auth_router
from app.routers.goals import goals_router
from app.routers.sessions import sessions_router
from app.routers.stats import stats_router
from app.routers.user_book import user_book_router

from fastapi.middleware.cors import CORSMiddleware

# Called once at startup?
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield
    
app = FastAPI(
    lifespan=lifespan,
    debug=True
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(books_router)
app.include_router(user_router)
app.include_router(auth_router)
app.include_router(goals_router)
app.include_router(sessions_router)
app.include_router(stats_router)
app.include_router(user_book_router)

# ------------------------------------- #
#              main router              #
# ------------------------------------- #
@app.get("/")
def read_root():
    return {"message": "Welcome to the Book Reading Progress API"}

handler = Mangum(app)

