from datetime import datetime
from sqlmodel import Session, SQLModel, create_engine, select, text

from backend.schema import AuthorInDB, BookInDB


# Create the engine and database 
engine = create_engine(
    "sqlite:///backend/database.db",
    echo=True,
    connect_args={"check_same_thread": False},
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session



