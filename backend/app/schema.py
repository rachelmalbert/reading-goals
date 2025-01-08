from datetime import datetime, date
from typing import  Optional, Union
from pydantic import BaseModel
from sqlmodel import Relationship, Field, SQLModel

# ------------------------------------- #
#            Database Models            #
# ------------------------------------- #

class BookAuthorLinkInDB(SQLModel, table=True):
     """Database model for many-to-many relation of books to authors."""

     __tablename__ = "book_author_links"

     book_id: str = Field(foreign_key="books.id", primary_key=True)
     author_id: int = Field(foreign_key="authors.id", primary_key=True)

class UserBookLinkInDB(SQLModel, table=True):
    """Database model for many-to-many relation of users to books."""

    __tablename__ = "user_books_links"

    user_id: int = Field(foreign_key="users.id", primary_key=True)
    book_id: str = Field(foreign_key="books.id", primary_key=True)
    
    start_date: Optional[date] = None
    previous_page: Optional[int] = 0
    current_page: Optional[int] = 0
    finish_date: Optional[date] = None
    minutes_spent: Optional[int] = 0
    status: Optional[str] = "up next"

    user: Optional["UserInDB"] = Relationship(back_populates="user_books_links")
    book: Optional["BookInDB"] = Relationship(back_populates="user_books_links")

class UserInDB(SQLModel, table=True):
    """Database model for a user."""

    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True) 
    username: str = Field(unique=True, index=True) 
    hashed_password: Optional[str] = None
    created_at: Optional[datetime] = Field(default_factory=datetime.now) 

    books: list["BookInDB"] = Relationship(back_populates="users",
                                           link_model=UserBookLinkInDB) 
    user_books_links: list["UserBookLinkInDB"] = Relationship(back_populates="user")
    goals: list["GoalInDB"] = Relationship(back_populates="user")


class BookInDB(SQLModel, table=True):
    """Database model for a book."""

    __tablename__ = "books"

    id: str = Field(primary_key=True) 
    title: str = Field(index=True) 
    subtitle: Optional[str] = None
    published: Optional[str] = None
    description: Optional[str] = None
    page_count: Optional[int] = None
    cover_url: Optional[str] = None

    authors: list["AuthorInDB"] = Relationship(back_populates="books",
                                             link_model=BookAuthorLinkInDB) 
    users: list["UserInDB"] = Relationship(back_populates="books",
                                           link_model=UserBookLinkInDB) 
    user_books_links: list["UserBookLinkInDB"] = Relationship(back_populates="book")

class AuthorInDB(SQLModel, table=True):
    """Database model for an author."""

    __tablename__ = "authors"

    id: Optional[int] = Field(default=None, primary_key=True) 
    name: str = Field(index=True, unique=True) 

    books: list["BookInDB"] = Relationship(back_populates="authors",
                                           link_model=BookAuthorLinkInDB) 


class GoalInDB(SQLModel, table=True):
    """Database model for a Goal"""

    __tablename__ = "goals"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    type: Optional[str] = None
    period: Optional[str] = None # yearly, monthly, weekly, daily
    amount: Optional[int] = None

    user: UserInDB = Relationship(back_populates="goals")

class DailyStatInDB(SQLModel, table=True):
    """Database model for a Daily Reading Stat"""

    __tablename__ = "stats"

    user_id: int = Field(foreign_key="users.id", primary_key=True)
    y_m_d: Optional[date] = Field(default_factory=date.today, primary_key=True) 
    pages: Optional[int] = 0
    minutes: Optional[int] = 0

class SessionInDB(SQLModel, table=True):
    """Database model for a daily reading stat"""

    __tablename__ = "sessions"
    id: Optional[int] = Field(default=None, primary_key=True)

    user_id: int = Field(foreign_key="users.id")
    book_id: str = Field(foreign_key="books.id")
    prev_page: Optional[int] = 0
    cur_page: Optional[int] = 0
    minutes: Optional[int] = 0
    created_at: Optional[date] = None

# ------------------------------------- #
#            Request models             #
# ------------------------------------- #

class UserRegistrationRequest(SQLModel):
    """Request model to register a new user."""

    username: str
    password: str

class UpdateStatsRequest(BaseModel):
    """Request model to update a stat"""

    book_id: str
    y_m_d: date
    cur_page: int
    minutes: int

class SessionRequest(BaseModel):
    """Request model to add a new session"""

    user_id: int 
    book_id: str
    cur_page: Optional[int]
    minutes: Optional[int] 
    created_at: Optional[date]

class GoalRequest(BaseModel):
    """Request model to add a new goal"""

    type: str # books, pages, or minutes
    period: str # year, month, week, day
    amount: int 
    
# ------------------------------------- #
#            Response models            #
# ------------------------------------- #

class UserResponse(SQLModel):
    """Response model for a user"""

    first_name: str
    username: str
    email: str

class Author(BaseModel):
    """Model for an author"""

    name: Optional[str]

class AuthorCollection(BaseModel):
     """Model for a collection of authors"""
     
     authors: Optional[list[Author]]

class Book(BaseModel):
    """Model for a book"""

    id: Optional[str]
    title: Optional[str]
    subtitle: Optional[str]
    published: Optional[str]
    description: Optional[str]
    page_count: Optional[int]
    cover_url: Optional[str]
    authors: Optional[list[Union[str, AuthorInDB]]]


class BookCollectionResponse(BaseModel):
    """Response model for a collection of books"""

    books: list[Book] = []


class User(BaseModel):
    """Response model for user"""

    user_id: Optional[int]
    username: Optional[str]

class BookResponse(BaseModel):
    """Response model for a book with user progress information"""

    book: BookInDB
    status: str = "up next"
    minutes_spent: Optional[int] = 0
    start_date: Optional[datetime] = None
    current_page: Optional[int] = 0
    finish_date: Optional[datetime] = None
    authors: Optional[list[AuthorInDB]] = None

class TotalStatsResponse(BaseModel):
    """Response model for user stats"""

    total_pages: int
    total_minutes: int
    total_books: int



