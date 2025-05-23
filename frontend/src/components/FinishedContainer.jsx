import "../styles/FinishedContainer.css";
import { useState } from "react";
import Popup from "../components/Popup";
import BookInfo from "./BookInfo";

function FinishedCard({ user_book }) {
  const author = user_book.authors?.[0] || "Unknown Author";

  const [showBookInfo, setShowBookInfo] = useState(false);

  const handleEditIconClick = (event) => {
    event.preventDefault();
    setShowBookInfo(true);
  };

  return (
    <>
      <div key={user_book.key} className="finished-book-card">
        <div onClick={handleEditIconClick} className="book-cover-img">
          <div className="overlay">
            <i className="fas fa-trash edit-icon"></i>
          </div>
          <img className="book-cover-img" src={user_book["book"].cover_url}></img>
        </div>
        <div className="book-title">{user_book["book"].title}</div>
        <div className="book-author">{author.name}</div>

      <Popup isOpen={showBookInfo} onClose={() => setShowBookInfo(false)}>
        <BookInfo setShowBookInfo={setShowBookInfo} user_book={user_book}></BookInfo>
      </Popup>

      </div>
    </>
  );
}

function FinishedContainer({ bookList }) {
  return (
    <div className="finished-container">
      <h3>
        Finished
        <i className="fa-solid fa-square-check checkmark"></i>
      </h3>
      {bookList.map((user_book) => (
        <FinishedCard key={user_book["book"].id} user_book={user_book}></FinishedCard>
      ))}
    </div>
  );
}
export default FinishedContainer;
