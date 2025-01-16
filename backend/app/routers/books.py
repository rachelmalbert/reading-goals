from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app import database as db
from app.routers.auth import get_current_user
from app.schema import (
        Book,
        BookCollectionResponse,
        UserInDB,
        )
import httpx

from app import database as db


books_router = APIRouter(prefix="/books", tags=["Books"])
db_dependency = Annotated[Session, Depends(db.get_session)]
user_dependency = Annotated[UserInDB, Depends(get_current_user)]

# ------------------------------------- #
#              READ                     #
# ------------------------------------- #

@books_router.get("/{book_id}")
def get_book(session: db_dependency, book_id: str):
       """Gets book with book_id"""
       book = db.get_book_by_id(session, book_id)
       return book

@books_router.get("/google/{query}", response_model=BookCollectionResponse)
async def search_google_books(*, query: str):
        """Search for a book by title or author"""
        google_api_url = f"https://www.googleapis.com/books/v1/volumes?q={query}"

        # Get 10 books from search query using google books api
        async with httpx.AsyncClient(timeout=10.0) as client:
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
