import calendar
from collections import defaultdict
from datetime import date, datetime, timedelta
from fastapi import HTTPException
import httpx
from sqlmodel import Session, SQLModel, create_engine, select
from sqlalchemy import desc, extract, func

from app.schema import (
        BookInDB,
        Book,
        AuthorInDB,
        UserInDB,
        UserBookLinkInDB,
        BookResponse,
        DailyStatInDB,
        GoalInDB,
        SessionRequest,
        SessionInDB,
        TotalStatsResponse,
        GoalRequest
        )

# Create the engine and database 
engine = create_engine(
    "sqlite:///app/database.db",
    echo=True,
    connect_args={"check_same_thread": False},
)

def create_db_and_tables():
    print("Creating database tables...")
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

# --------------#
#   USER_BOOK   #
# --------------#

def get_current_book(session: Session, user_id: int):
      """Gets the book the user is currently reading"""
      sessions = get_sessions(session, user_id)
      if not sessions:
          return None
      # Get all in progress user_book_links
      user_book_links = get_user_book_links(session, user_id)
      in_progress=set()
      for user_book in user_book_links:
            if user_book.status == "in progress":
                 in_progress.add(user_book.book.id)
      current_sessions=[]
      for sesh in sessions:
            if sesh.book_id in in_progress:
                  current_sessions.append(sesh)
      most_recent = current_sessions[0]
      current_book = get_book_by_id(session, most_recent.book_id)
      return current_book

def get_user_book_links(session: Session, user_id: int):
        """Get all user book links belonging to user"""
        query = select(UserBookLinkInDB).where(UserBookLinkInDB.user_id==user_id)
        user_book_links = session.exec(query).all()
        res = []
        for link in user_book_links:
                add = BookResponse(book=link.book, status=link.status, minutes_spent=link.minutes_spent, authors=link.book.authors, start_date=link.start_date, current_page=link.current_page, finish_date=link.finish_date)
                res.append(add)
        return res
        
def get_user_book_link(session: Session, user_id: int, book_id: str):
        """Get user book link given user_id and book_id"""
        query = select(UserBookLinkInDB).where(UserBookLinkInDB.user_id==user_id, UserBookLinkInDB.book_id==book_id)
        user_book_link = session.exec(query).first()
        if user_book_link:
            return user_book_link
        else:
               raise HTTPException(status_code=404, detail="User Book Link not found")

def get_current_user_book_link(session: Session, user_id: int):
        """Gets the user book link of current book"""
        current_book = get_current_book(session, user_id)
        print("CURB$", current_book)
        if not current_book:
              return None
        current_user_book_link = get_user_book_link(session, user_id, current_book.id)
        if current_user_book_link:
            return {"user_book_link": current_user_book_link, "book": current_user_book_link.book}
        else:
               raise HTTPException(status_code=404, detail="User Book Link not found")

def get_finished_books(session: Session):
    """Get finished books"""
    query = select(UserBookLinkInDB).where(UserBookLinkInDB.status=="finished")
    finished = session.exec(query).all()
    return finished

def start_book(session: Session, user_id: int, book_id: str):
        """Start reading book"""
        user_book_link = get_user_book_link(session, user_id, book_id)
        user_book_link.start_date = datetime.now()
        user_book_link.status = "in progress"
        session.commit()
        session.refresh(user_book_link)
        return user_book_link

def finish_book(session: Session, user_id: int, book_id: str):
        """Finish reading book"""
        user_book_link = get_user_book_link(session, user_id, book_id)
        user_book_link.finish_date = datetime.now()
        user_book_link.status = "finished"
        session.commit()
        session.refresh(user_book_link)
        return user_book_link

def update_status(session: Session, user_id: int, book_id: str, status: str):
       """Update user_book_link status"""
       user_book_link = get_user_book_link(session, user_id, book_id)
       user_book_link.status = status
       session.commit()
       session.refresh(user_book_link)
       return user_book_link.status

def update_book_pages(session: Session, user_id: int, book_id: str, cur_page: int, prev_page: int):
       """Update current page of book belonging to user"""
       user_book_link = get_user_book_link(session, user_id, book_id)
       user_book_link.previous_page = prev_page
       user_book_link.current_page = cur_page
       session.commit()
       session.refresh(user_book_link)
       return user_book_link

def update_book_minutes(session: Session, user_id: int, book_id: str, minutes: int):
        """Update minutes spent reading book belonging to user"""
        user_book_link = get_user_book_link(session, user_id, book_id)
        user_book_link.minutes_spent += minutes
        session.commit()
        session.refresh(user_book_link)
        return user_book_link

def delete_book(session: Session, user_id: int, book_id: str):
        """Delete book with id of book_id from the user's library"""
        query = select(UserBookLinkInDB).where(UserBookLinkInDB.user_id==user_id, UserBookLinkInDB.book_id==book_id)
        book_to_delete = session.exec(query).first()
        if book_to_delete is None:
                raise HTTPException(status_code=404, detail="Book not found in user library")
        session.delete(book_to_delete)
        session.commit()
    
def get_book_progress(session: Session, user_id: int, book_id: str):
    """Gets the progress of book with book_id"""
    user_book_link = get_user_book_link(session, user_id, book_id)
    book = get_book_by_id(session, book_id)
    return {"cur_page": user_book_link.current_page, "pages": book.page_count}
      
# --------- #
#   BOOKS   #
# --------- #

def add_book(session: Session, book: Book):
        """Add book to database"""

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

def add_author(session: Session, authors_name: str):
        """Add author to the database given an authors name"""
        
        existing_author = get_author(session, authors_name)

        if existing_author: 
                return existing_author
        
        new_author = AuthorInDB(name = authors_name)
        session.add(new_author)
        session.commit()
        session.refresh(new_author)
        return new_author


def get_author(session: Session, authors_name: str):
        """Get author by name"""
        author = session.exec(select(AuthorInDB).where(AuthorInDB.name == authors_name)).first()
        return author

def get_book_by_id(session: Session, book_id: str):
        """Get book by id"""
        return session.exec(select(BookInDB).where(BookInDB.id == book_id)).first()
        
       
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
#   GOALS   #
# --------- #

def get_goal(session : Session, goal_id: int):
    """Get the user's goal for the given time period"""
    goal = session.get(GoalInDB, goal_id)
    return goal

def get_goal_progress(session: Session, user_id: int, goal_id: int):
    """Get the users progress of a goal"""
    goal = get_goal(session, goal_id)
    cur_year = datetime.now().year
    cur_month = datetime.now().month
    if goal.type == "books":
        finished = get_finished_books(session)
        if goal.period == "year":
              return len([book for book in finished if book.finish_date.year == cur_year])
        if goal.period == "month":
              return len([book for book in finished if book.finish_date.month == cur_month and book.finish_date.year == cur_year])         
    if goal.period == "month":
        monthly_stats = get_monthly_stats(session, user_id)[type]
        return monthly_stats

    if goal.period == "day":
        daily_stats =  get_todays_stats(session, user_id)
        if daily_stats:
            if goal.type == "minutes":
                return  daily_stats.minutes
            if goal.type == "pages":
                return daily_stats.type
        else: return 0
    
def update_goal(session : Session, user: UserInDB, goal_id: int, goalUpdate: GoalRequest):
    
    goal = get_goal(session, goal_id)
    setattr(goal, "period", goalUpdate.period)
    setattr(goal, "type", goalUpdate.type)
    setattr(goal, "amount", goalUpdate.amount)

    session.add(goal)
    session.commit()
    session.refresh(goal)
    return goal
    
# --------- #
#  SESSIONS #
# --------- #

def add_session(session: Session, user_id: int, new_session: SessionRequest):
       """Add a new user reading session"""
       
       book_id = new_session.book_id
       prev_page = get_user_book_link(session, user_id, book_id).current_page
       cur_page = new_session.cur_page
       minutes = new_session.minutes
       date_created = new_session.created_at

       pages_read = cur_page - prev_page
       
       # Add the new reading session
       add_session = SessionInDB(**new_session.model_dump(), prev_page=prev_page)
       session.add(add_session)
       session.commit()
       session.refresh(add_session)

       # Update user_book_link
       update_book_pages(session, user_id, book_id, cur_page, prev_page)
       update_book_minutes(session, user_id, book_id, minutes)

       # Update Daily Stat
       update_daily_stat(session, user_id, date_created, pages_read, minutes)

       return add_session

def get_sessions(session: Session, user_id: int):
       """Gets all reading sessions belonging to user"""
       query = select(SessionInDB).where(SessionInDB.user_id==user_id).order_by(desc(SessionInDB.created_at))
       sessions = session.exec(query).all()
       return sessions

def get_sessions_by_date(session: Session, user_id: int):
       """Gets all reading sessions belonging to user by date"""
       query = select(SessionInDB).where(SessionInDB.user_id==user_id).order_by(desc(SessionInDB.created_at))
       sessions = session.exec(query).all()
       # {date: [sessions]}
       sessions_by_date = defaultdict(list)
       for session in sessions:
        session_date = session.created_at
        sessions_by_date[session_date].append(session)
       return sessions_by_date

# --------- #
#   STATS   #
# --------- #

def update_daily_stat(session: Session, user_id: int, y_m_d: date, pages_read: int, minutes: int):
        """Create or update daily reading stat"""
        query = select(DailyStatInDB).where(DailyStatInDB.user_id==user_id, DailyStatInDB.y_m_d==y_m_d)
   
        daily_stat = session.exec(query).first()
        # if the daily stat already exists, update it
        if daily_stat:
               daily_stat.pages += pages_read
               daily_stat.minutes += minutes
               session.commit()
               session.refresh(daily_stat)
               return daily_stat
        else:   # else, create new stat
               new_stat = DailyStatInDB(user_id=user_id,
                                        y_m_d=y_m_d,
                                        pages=pages_read,
                                        minutes=minutes)
               session.add(new_stat)
               session.commit()
               session.refresh(new_stat)
               return new_stat
        
def get_total_stats(session: Session, user_id: int):
       """Get total stats for user"""
       pages = select(func.sum(DailyStatInDB.pages)).where(DailyStatInDB.user_id==user_id)
       minutes = select(func.sum(DailyStatInDB.minutes)).where(DailyStatInDB.user_id==user_id)

       books = select(UserBookLinkInDB).where(UserBookLinkInDB.user_id==user_id, UserBookLinkInDB.status=="finished")

       total_pages = session.exec(pages).first() 
       total_minutes = session.exec(minutes).first()
       total_books = len(session.exec(books).all())
       res = TotalStatsResponse(total_pages=total_pages if total_pages else 0, total_minutes=total_minutes if total_minutes else 0, total_books=total_books if total_books else 0)
       return res

def get_todays_stats(session: Session, user_id: int):
    """Get todays stats for user"""   
    current_date = datetime.today().strftime('%Y-%m-%d')
    query = select(DailyStatInDB).where(DailyStatInDB.user_id==user_id, DailyStatInDB.y_m_d == current_date)
    todays_stats = session.exec(query).first()
    return todays_stats

def get_daily_stats(session: Session, user_id: int, date: date):
      """Get daily stat"""

      query = select(DailyStatInDB).where(DailyStatInDB.user_id==user_id, DailyStatInDB.y_m_d==date)
      stat = session.exec(query).first()
      if stat:
        return {"minutes": stat.minutes, "pages": stat.pages}
      return {"minutes": 0, "pages": 0}

def get_monthly_stats(session: Session, user_id: int, month: int, year: int):
    """Get monthly stats for user"""   
    cur_month = month
    cur_year = year
    minutes_query = select(func.sum(DailyStatInDB.minutes)).where(DailyStatInDB.user_id==user_id, extract('month', DailyStatInDB.y_m_d) == cur_month, extract('year', DailyStatInDB.y_m_d) == cur_year)
    minutes = session.exec(minutes_query).first()
    pages_query = select(func.sum(DailyStatInDB.pages)).where(DailyStatInDB.user_id==user_id, extract('month', DailyStatInDB.y_m_d) == cur_month, extract('year', DailyStatInDB.y_m_d) == cur_year)
    pages = session.exec(pages_query).first()
    return {"minutes": minutes, "pages": pages}

def get_chart_data(session: Session, user_id: int, period: str):
        current_date = datetime.today()
        cur_year = current_date.year
        cur_month = current_date.month
        cur_day = current_date.day
        cur_weekday = current_date.weekday()
        pages, minutes, labels = [], [], []
        label_numbers = []
        stat = {}
        match period:
              case "weekly":
                    label_numbers = rotate_right(list(range(0, 7)), 6 - cur_weekday)
                    current_date = date(cur_year, cur_month, cur_day)
                
                    subtract = 6
                    start_date = current_date - timedelta(days=subtract)
                
                    for number in label_numbers:
                        labels.append(calendar.day_abbr[number])

                        stat = get_daily_stats(session, user_id, start_date)
                        pages.append(stat["pages"])
                        minutes.append(stat["minutes"])
                        subtract = subtract - 1
                        start_date = current_date - timedelta(days=subtract)
                        
              case "monthly":        
                    _, days_in_month = calendar.monthrange(cur_year, cur_month)
                    label_numbers = rotate_right(list(range(1, days_in_month)), days_in_month - 1 - cur_day)
                  
                    for day in label_numbers:
                          current_date =  date(cur_year, cur_month, day)
                          stat = get_daily_stats(session, user_id, current_date)
                          pages.append(stat["pages"])
                          minutes.append(stat["minutes"])
                          labels.append(day)
              case "yearly":
                    cur_number =  datetime.today().month
                    label_numbers = rotate_right(list(range(1, 13)), 12 - cur_number)
                    for month in label_numbers:
                          stat = get_monthly_stats(session, user_id, month, cur_year)
                          pages.append(stat["pages"])
                          minutes.append(stat["minutes"])
                          labels.append(calendar.month_abbr[month])

        return {"labels": labels, "pages": pages, "minutes": minutes}
                
# --------- #
#   Delete  #
# --------- #     

def rotate_right(arr, n):
    # Rotate by n positions to the right
    return arr[-n % len(arr):] + arr[:-n % len(arr)]

        


