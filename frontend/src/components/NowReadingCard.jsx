import "../styles/NowReadingCard.css";
import { useQuery } from "@tanstack/react-query";
import { useApi, useUser } from "../hooks";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import UpdateBook from "./UpdateBook";
import Popup from "./Popup";
import emptyBook from "../assets/images/empty-book.png";

function AddBookCard({ url }) {
  const navigate = useNavigate();

  const onClick = (e) => {
    e.preventDefault();
    navigate("/bookshelf");
  };

  return (
    <div className="now-reading-container">
      <h2>Now Reading</h2>
      <img src={emptyBook} alt="Book Cover" className="empty-book-cover" />
      <div className="page-progress"></div>
      <button onClick={onClick} className="continue-btn">
        Add Book
      </button>
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
            Page {currentUserBookLink.current_page} of {currentUserBookLink.book.page_count}
          </div>
          <button onClick={handleClick} className="continue-btn">
            Continue
          </button>
          <Popup isOpen={showUpdatePopup} onClose={() => setShowUpdatePopup(false)}>
            <UpdateBook user_book={currentUserBookLink} setShowUpdatePopup={setShowUpdatePopup} type={"read"} />
          </Popup>
        </div>
      )}
    </>
  );
}

export default NowReadingCard;
