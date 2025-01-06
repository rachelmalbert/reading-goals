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

user_router = APIRouter(prefix="/user", tags=["User"])

user_dependency = Annotated[UserInDB, Depends(get_current_user)]
db_dependency = Annotated[Session, Depends(db.get_session)]

class EntityNotFoundException(Exception):
    def __init__(self, *, entity_name: str, entity_id: str):
        self.entity_name = entity_name
        self.entity_id = entity_id

# ------------------------------------- #
#              CREATE                   #
# ------------------------------------- #

# @user_router.post("/checkout/{book_id}", response_model=list[BookInDB])
# async def checkout_book(session: db_dependency, user: user_dependency, book_id: str):
#         """Add the book with book_id to the users library"""

#         # Check if the book with book_id is already in the database
#         existing_book = db.get_book_by_id(session, book_id)

#         # If the book is not in the database, add it to the database and link it to the user
#         if existing_book is None:
#                 # Link the new book to the user
#                 book = await db.get_google_book_by_id(book_id)
#                 added = db.add_book(session, book)
#                 added.users.append(user)
#                 session.commit()
#                 session.refresh(added)
#                 return user.books
        
#         # If the book is already linked to the user, just return the book
#         if user in existing_book.users:
#                 return user.books
        
#         # Link the existing book to the user
#         existing_book.users.append(user)
#         session.commit()
#         session.refresh(existing_book)
#         return user.books

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

@user_router.get("/self", response_model=UserInDB)
def get_self(user: user_dependency):
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# @user_router.get("/books")
# def get_user_books(session: db_dependency, user: user_dependency):
#         # print("user id", user.id)
#         """Get all books belonging to the current user"""
#         user_book_links = db.get_user_book_links(session, user_id=user.id)
#         return user_book_links

# @user_router.get("/current-book")
# def get_current_book(session: db_dependency, user: user_dependency):
#     sessions = db.get_sessions(session, user.id)
#     if not sessions:
#           return None
#     most_recent = sessions[0]
#     for read_session in sessions:
#         if read_session.created_at > most_recent.created_at:
#             most_recent = read_session
#     current_book = db.get_book_by_id(session, most_recent.book_id)
#     book_progress = db.get_book_progress(session, user.id, most_recent.book_id)
#     return {"book": current_book, "progress": book_progress}

# @user_router.get("/current-user-book-link")
# def get_current_user_book_link(session: db_dependency, user: user_dependency):
#         """Get the user_book_link for the current book the user is reading"""
#         # current_book = db.get_current_book(session, user.id)
#         # user_book_link = db.get_user_book_link(session, user.id, current_book.book_id)
#         current_user_book_link = db.get_current_user_book_link(session, user.id)
#         return current_user_book_link



# @user_router.get("/books/{year}")
# def get_finished_books_by_year(session: db_dependency, year: int):
#         """Get all user_books that were finished in the year"""
#         finished_books = db.get_finished_books_by_year(session, year)
#         return finished_books

# @user_router.get("/progress/{type}/{period}")
# def get_goal_progress(session: db_dependency, user: user_dependency, type: str, period: str):
#         progress = db.get_goal_progress(session, user.id, type, period)
#         return progress

# @user_router.get("/{book_id}/progress")
# def get_book_progress(session: db_dependency, user: user_dependency, book_id: str):
#     """Gets the users progress on book with book_id"""
#     book_progress = db.get_book_progress(session, user.id, book_id)
#     return book_progress

   

# ------------------------------------- #
#              UPDATE                   #
# ------------------------------------- #

# @user_router.put("/start/{book_id}")
# def start_reading(session: db_dependency, user: user_dependency, book_id: str):
#         """Start reading book"""

#         updated = db.start_book(session, user.id, book_id)
#         if updated is None:
#                 return {"error": "Book link not found or failed to update."}, 404
#         return updated

# @user_router.put("/finish/{book_id}")
# def start_reading(session: db_dependency, user: user_dependency, book_id: str):
#         """Finish reading book"""

#         updated = db.finish_book(session, user.id, book_id)
#         if updated is None:
#                 return {"error": "Book link not found or failed to update."}, 404
#         return updated

# @user_router.put("/{book_id}/{status}")
# def update_status(session: db_dependency, user: user_dependency, book_id: str, status: str):
#         """Update user_book status"""
#         status = db.update_status(session, user.id, book_id, status)
#         return status

# ------------------------------------- #
#              DELETE                   #
# ------------------------------------- #

@user_router.delete("/delete/{book_id}", response_model=list[BookInDB])
def checkin_book(session: db_dependency, user: user_dependency, book_id: str):
        """Deletes book with book_id from user library"""
        db.delete_book(session, user.id, book_id)
        return user.books
