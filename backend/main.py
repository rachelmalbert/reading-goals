from contextlib import asynccontextmanager
from fastapi import FastAPI
from backend.database import create_db_and_tables
from backend.routers.books import books_router
from backend.routers.users import users_router
from backend.routers.auth import auth_router
from backend.routers.goals import goals_router

# Called once at startup?
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield
    
app = FastAPI(
    lifespan=lifespan,
    debug=True
)

app.include_router(books_router)
app.include_router(users_router)
app.include_router(auth_router)
app.include_router(goals_router)


# ------------------------------------- #
#              main router              #
# ------------------------------------- #
@app.get("/")
def read_root():
    return {"message": "Welcome to the Book Reading Progress API"}

