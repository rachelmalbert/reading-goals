from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from backend import database as db
from backend.routers.auth import get_current_user
from backend.schema import (
        BookInDB,
        Book,
        BookCollectionResponse,
        UserInDB,
        SessionRequest,
        UpdateStatsRequest,
        )
import httpx

from backend import database as db


books_router = APIRouter(prefix="/books", tags=["Books"])
db_dependency = Annotated[Session, Depends(db.get_session)]
user_dependency = Annotated[UserInDB, Depends(get_current_user)]

# ------------------------------------- #
#              CREATE                   #
# ------------------------------------- #
# @books_router.post("/checkout/{book_id}", response_model=list[BookInDB])
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

# @books_router.get("")
# def get_user_books(session: db_dependency, user: user_dependency):
#         # print("user id", user.id)
#         """Get all books belonging to the current user"""
#         user_book_links = db.get_user_book_links(session, user_id=user.id)
#         return user_book_links

# @books_router.get("/{book_id}/cover")
# def get_cover_url(session: db_dependency, book_id: str):
#        """Gets the cover_url of book with book_id"""
#        url = db.get_cover_url(session, book_id)
#        return url

@books_router.get("/{book_id}")
def get_book(session: db_dependency, book_id: str):
       """Gets book with book_id"""
       book = db.get_book_by_id(session, book_id)
       return book

# @books_router.get("/sessions")
# def get_sessions(session: db_dependency, user: user_dependency):
#        """Get all user reading sessions"""
#        sessions = db.get_sessions(session, user.id)
#        return sessions

@books_router.get("/google/{query}", response_model=BookCollectionResponse)
async def search_google_books(*, query: str):
        """Search for a book by title or author"""
        google_api_url = f"https://www.googleapis.com/books/v1/volumes?q={query}"

        # Get 10 books from search query using google books api
        async with httpx.AsyncClient() as client:
               response = await client.get(google_api_url)
               if response.status_code != 200:
                     raise HTTPException(status_code=response.status_code, detail="Error fetching data from Google Books API")
               data = response.json()

        collection = BookCollectionResponse()
        # Parse the 10 books from json to Book objects, add to BookCollectionResponse Object
        for book in data["items"]:
                image_links = book["volumeInfo"].get("imageLinks", {})
                add = Book(id=book["id"],
                           title=book["volumeInfo"].get("title"),
                           subtitle=book["volumeInfo"].get("subtite", None),
                           published=book["volumeInfo"].get("publishedDate", None),
                           description=book["volumeInfo"].get("description", None),
                           page_count=book["volumeInfo"].get("pageCount", None),
                           cover_url=image_links.get("thumbnail", None),
                           authors=book["volumeInfo"].get("authors", None),
                           )
                collection.books.append(add)
        return collection



# ------------------------------------- #
#              UPDATE                   #
# ------------------------------------- #
# @books_router.put("/start/{book_id}")
# def start_reading(session: db_dependency, user: user_dependency, book_id: str):
#         """Start reading book"""

#         updated = db.start_book(session, user.id, book_id)
#         if updated is None:
#                 return {"error": "Book link not found or failed to update."}, 404
#         return updated

# @books_router.put("/{book_id}/{status}")
# def update_status(session: db_dependency, user: user_dependency, book_id: str, status: str):
#         """Update user_book status"""
#         status = db.update_status(session, user.id, book_id, status)
#         return status
# @books_router.put("/update/stats")
# def update_stats(session: db_dependency, user: user_dependency, update_stats: UpdateStatsRequest):
#     """Update daily stat for user and book stat for book with book_id"""
#     return db.update_stats(session, user.id, update_stats)

# @books_router.put("/update/stats")
# def update_stats(session: db_dependency, user: user_dependency, update_stats: SessionRequest):
#     """Update daily stat for user and book stat for book with book_id"""
#     return db.update_stats(session, user.id, update_stats)


# ------------------------------------- #
#              DELETE                   #
# ------------------------------------- #

# @books_router.delete("/delete/{book_id}", response_model=list[BookInDB])
# def checkin_book(session: db_dependency, user: user_dependency, book_id: str):
#         """Deletes book with book_id from user library"""
#         db.delete_book(session, user.id, book_id)
#         return user.books

