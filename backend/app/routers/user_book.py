from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app import database as db
from app.schema import (
    UserInDB,
    BookInDB
)
from app.routers.auth import get_current_user

user_book_router = APIRouter(prefix="/user_book", tags=["UserBook"])

user_dependency = Annotated[UserInDB, Depends(get_current_user)]
db_dependency = Annotated[Session, Depends(db.get_session)]

class EntityNotFoundException(Exception):
    def __init__(self, *, entity_name: str, entity_id: str):
        self.entity_name = entity_name
        self.entity_id = entity_id

# ------------------------------------- #
#              CREATE                   #
# ------------------------------------- #

@user_book_router.post("/checkout/{book_id}", response_model=list[BookInDB])
async def checkout_book(session: db_dependency, user: user_dependency, book_id: str):
        """Add the book with book_id to the users library"""

        # Check if the book with book_id is already in the database
        existing_book = db.get_book_by_id(session, book_id)

        # If the book is not in the database, add it to the database and link it to the user
        if existing_book is None:
                # Link the new book to the user
                book = await db.get_google_book_by_id(book_id)
                added = db.add_book(session, book)
                added.users.append(user)
                session.commit()
                session.refresh(added)
                return user.books
        
        # If the book is already linked to the user, just return the book
        if user in existing_book.users:
                return user.books
        
        # Link the existing book to the user
        existing_book.users.append(user)
        session.commit()
        session.refresh(existing_book)
        return user.books

# ------------------------------------- #
#              READ                     #
# ------------------------------------- #

@user_book_router.get("/books")
def get_user_books(session: db_dependency, user: user_dependency):
        """Get all books belonging to the current user"""
        user_book_links = db.get_user_book_links(session, user_id=user.id)
        return user_book_links

@user_book_router.get("/current-book")
def get_current_book(session: db_dependency, user: user_dependency):
    sessions = db.get_sessions(session, user.id)
    if not sessions:
          return None
    # Get all in progress user_book_links
    user_book_links = db.get_user_book_links(session, user.id)
    print("REACHED")
    in_progress=set()
    for user_book in user_book_links:
           if user_book.status == "in progress":
                 in_progress.add(user_book.book.id)
    print("Progress@", in_progress)
    current_sessions=[]
    for sesh in sessions:
           if sesh.book_id in in_progress:
                  current_sessions.append(sesh)
    print("@currentsessions", current_sessions)

    most_recent = current_sessions[0]
    print("@most", most_recent)


    # for read_session in sessions:
    #     if read_session.created_at > most_recent.created_at:
    #         most_recent = read_session
    current_book = db.get_book_by_id(session, most_recent.book_id)
    book_progress = db.get_book_progress(session, user.id, most_recent.book_id)
    return {"book": current_book, "progress": book_progress}

@user_book_router.get("/current-user-book-link")
def get_current_user_book_link(session: db_dependency, user: user_dependency):
        """Get the user_book_link for the current book the user is reading"""
        current_user_book_link = db.get_current_user_book_link(session, user.id)
        return current_user_book_link


# ------------------------------------- #
#              UPDATE                   #
# ------------------------------------- #

@user_book_router.put("/start/{book_id}")
def start_reading(session: db_dependency, user: user_dependency, book_id: str):
        """Start reading book"""

        updated = db.start_book(session, user.id, book_id)
        if updated is None:
                return {"error": "Book link not found or failed to update."}, 404
        return updated

@user_book_router.put("/finish/{book_id}")
def start_reading(session: db_dependency, user: user_dependency, book_id: str):
        """Finish reading book"""

        updated = db.finish_book(session, user.id, book_id)
        if updated is None:
                return {"error": "Book link not found or failed to update."}, 404
        return updated

# @user_book_router.get("/books/{year}")
# def get_finished_books_by_year(session: db_dependency, year: int):
#         """Get all user_books that were finished in the year"""
#         finished_books = db.get_finished_books_by_year(session, year)
#         return finished_books

# @user_book_router.get("/progress/{type}/{period}")
# def get_goal_progress(session: db_dependency, user: user_dependency, type: str, period: str):
#         progress = db.get_goal_progress(session, user.id, type, period)
#         return progress
