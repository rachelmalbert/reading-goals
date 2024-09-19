from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from backend import database as db
from backend.schema import BookInDB


books_router = APIRouter(prefix="/books", tags=["Books"])

# ------------------------------------- #
#              CREATE                   #
# ------------------------------------- #
@books_router.post("")
def create_book(*, session: Session = Depends(db.get_session), book: BookInDB):
        """Add a new book"""
        session.add(book)
        session.commit()
        session.refresh(book)
        return book

# ------------------------------------- #
#              READ                     #
# ------------------------------------- #

@books_router.get("")
def get_books(*, session: Session = Depends(db.get_session)):
        """Get all books"""
        books = session.exec(select(BookInDB)).all()
        return books

# ------------------------------------- #
#              UPDATE                   #
# ------------------------------------- #


# ------------------------------------- #
#              DELETE                   #
# ------------------------------------- #