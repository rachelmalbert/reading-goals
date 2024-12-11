from contextlib import asynccontextmanager
from fastapi import FastAPI
from backend.database import create_db_and_tables
from backend.routers.books import books_router
from backend.routers.user import user_router
from backend.routers.auth import auth_router
from backend.routers.goals import goals_router
from backend.routers.dashboard import dashboard_router
from backend.routers.sessions import sessions_router
from backend.routers.stats import stats_router

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
    allow_origins=["http://localhost:8000", "http://127.0.0.1:8000", "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(books_router)
app.include_router(user_router)
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(goals_router)
app.include_router(sessions_router)
app.include_router(stats_router)



# ------------------------------------- #
#              main router              #
# ------------------------------------- #
@app.get("/")
def read_root():
    return {"message": "Welcome to the Book Reading Progress API"}

