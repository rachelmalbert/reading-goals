from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from backend import database as db
from backend.routers.auth import get_current_user
from backend.schema import (
        BookInDB,
        Book,
        BookCollectionResponse,
        AuthorInDB,
        UserInDB,
        UserBookLinkInDB
        )
import httpx


books_router = APIRouter(prefix="/books", tags=["Books"])
db_dependency = Annotated[Session, Depends(db.get_session)]
user_dependency = Annotated[UserInDB, Depends(get_current_user)]

# ------------------------------------- #
#              CREATE                   #
# ------------------------------------- #
@books_router.post("/checkout/{book_id}", response_model=list[BookInDB])
async def checkout_book(session: db_dependency, user: user_dependency, book_id: str):
        """Add the book with book_id to the users library"""

        # Check if the book with book_id is already in the database
        existing_book = get_book_by_id(session, book_id)

        # If the book is not in the database, add it to the database and link it to the user
        if existing_book is None:
                # Link the new book to the user
                book = await get_google_book_by_id(book_id)
                added = add_book(session, book)
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
@books_router.get("")
def get_user_books(user: user_dependency):
        """Get all books belonging to the current user"""
        user_books = user.books
        return user_books

@books_router.get("/{query}", response_model=BookCollectionResponse)
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

# ------------------------------------- #
#              DELETE                   #
# ------------------------------------- #

@books_router.delete("/delete/{book_id}", response_model=list[BookInDB])
def checkin_book(session: db_dependency, user: user_dependency, book_id: str):
        """Deletes book with book_id from user library"""
        delete_book(session, user.id, book_id)
        return user.books


# ------------------------------------- #
#              Helpers                  #
# ------------------------------------- #

# --------- #
#   Create  #
# --------- #

def add_book(session: db_dependency, book: Book):
        """Add book to database"""

        # if the book already exists, return the book
        existing_book = get_book_by_id(session, book.id)
        if existing_book:
                return existing_book
        
        authors = []
        for author in book.authors:
                authors.append(add_author(session, author))
        new_book = BookInDB(**book.model_dump(exclude={"authors"}),
                            authors=authors)
        session.add(new_book)
        session.commit()
        session.refresh(new_book)
        return new_book

def add_author(session: db_dependency, authors_name: str):
        """Add author to the database given an authors name"""
        
        existing_author = get_author(session, authors_name)

        if existing_author: 
                return existing_author
        
        new_author = AuthorInDB(name = authors_name)
        session.add(new_author)
        session.commit()
        session.refresh(new_author)
        return new_author


# --------- #
#   Read    #
# --------- #

def get_user_by_id(session: db_dependency, user_id: int):
        """Get user by id"""
        user = session.get(UserInDB, user_id)
        if user is None:
                raise HTTPException(status_code=404, detail="User not found")
        return user

def get_author(session: db_dependency, authors_name: str):
        """Get author by name"""
        author = session.exec(select(AuthorInDB).where(AuthorInDB.name == authors_name)).first()
        return author

def get_book_by_id(session: db_dependency, book_id: str):
        """Get book by id, return None if not in database"""
        book = session.exec(select(BookInDB).where(BookInDB.id == book_id)).first()
        # if book is None:
        #         raise HTTPException(status_code=404, detail=f"Book with id: {book_id} not found")
        return book

async def get_google_book_by_id(google_id: str) -> Book:
        google_api_url = f"https://www.googleapis.com/books/v1/volumes/{google_id}"
        
        async with httpx.AsyncClient() as client:
                response = await client.get(google_api_url)
                if response.status_code != 200:
                     raise HTTPException(status_code=response.status_code, detail="Error fetching data from Google Books API")
                book = response.json()
        image_links = book["volumeInfo"].get("imageLinks", {})
        add = Book(id=book["id"],
                        title=book["volumeInfo"].get("title"),
                        subtitle=book["volumeInfo"].get("subtite", None),
                        published=book["volumeInfo"].get("publishedDate", None),
                        description=book["volumeInfo"].get("description", None),
                        page_count=book["volumeInfo"].get("pageCount", None),
                        cover_url=image_links.get("thumbnail", None),
                        authors=book["volumeInfo"].get("authors", None))
        return add

# --------- #
#   Update  #
# --------- #   

# --------- #
#   Delete  #
# --------- #     

def delete_book(session: db_dependency, user_id: int, book_id: str):
        """Delete book with id of book_id from the user's library"""
        query = select(UserBookLinkInDB).where(UserBookLinkInDB.user_id==user_id, UserBookLinkInDB.book_id==book_id)
        book_to_delete = session.exec(query).first()
        if book_to_delete is None:
                raise HTTPException(status_code=404, detail="Book not found in user library")
        session.delete(book_to_delete)
        session.commit()
        
