import { useQuery } from "@tanstack/react-query";
import { useApi, useUser } from "../hooks";
import { Link } from "react-router-dom";
import UpdateBook from "./UpdateBook";
import Popup from "./Popup";
import "../styles/NowReadingCard.css";
import { useState } from "react";

function AddBookCard({ url }) {
  return (
    <div className="now-reading-container">
      <h2>Now Reading</h2>
      <div className="add-book-card">
        <div className="plus-icon">
          <i className="fas fa-plus"></i> {/* Font Awesome "+" Icon */}
        </div>
        <div className="info">
          <Link to={url}>
            <button className="add-book-button">Add Book</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function NowReadingCard() {
  const api = useApi();
  const user = useUser();
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);

  const { data: current_book } = useQuery({
    queryKey: ["current_book", user.id],
    queryFn: () => api.get("/user_book/current-book").then((response) => response.json()),
  });

  const { data: currentUserBookLink } = useQuery({
    queryKey: ["currentUserBookLink"],
    queryFn: () => api.get("/user_book/current-user-book-link").then((response) => response.json()),
  });

  if (!current_book) {
    return <AddBookCard url="/bookshelf"></AddBookCard>;
  }

  const handleClick = (e) => {
    e.preventDefault();
    setShowUpdatePopup(true);
  };

  return (
    <>
      {currentUserBookLink && (
        <div className="now-reading-container">
          <h2>Now Reading</h2>
          <img src={currentUserBookLink.book.cover_url} alt="Book Cover" className="current-book-cover" />
          <div className="page-progress">
            Page {currentUserBookLink.user_book_link.current_page} of {currentUserBookLink.book.page_count}
          </div>
          <button onClick={handleClick} className="continue-btn">
            Continue
          </button>
          <Popup isOpen={showUpdatePopup} onClose={() => setShowUpdatePopup(false)}>
            <UpdateBook user_book={currentUserBookLink} setShowUpdatePopup={setShowUpdatePopup} type={"read"} />
          </Popup>
          {/* {showUpdatePopup && <UpdateBook user_book={currentUserBookLink} setShowUpdatePopup={setShowUpdatePopup}></UpdateBook>} */}
        </div>
      )}
    </>
  );
}

export default NowReadingCard;
