import { useState } from "react";
import Popup from "../components/Popup";
import "../styles/InProgressCard.css";
import UpdateBook from "./UpdateBook";

function InProgressCard({ user_book }) {
  const page_count = user_book["book"].page_count;
  const prev_page = user_book.current_page;

  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [updateType, setUpdateType] = useState("");

  const onClick = (e) => {
    e.preventDefault();
    setUpdateType(e.target.value);
    setShowUpdatePopup(true);
  };

  return (
    <>
      <div key={user_book.key} className="in-progress-card">
        <img className="book-cover-img" src={user_book["book"].cover_url}></img>
        <div className="info">
          <div className="progress">
            <progress value={prev_page} max={page_count}></progress>
          </div>
          <div className="progress-buttons">
            <button className="read-button" value="read" onClick={onClick}>
              Read
            </button>
            <button className="update-button" value="update" onClick={onClick}>
              Update
            </button>
          </div>
        </div>
        <Popup
          isOpen={showUpdatePopup}
          onClose={() => setShowUpdatePopup(false)}
        >
          <UpdateBook
            user_book={user_book}
            setShowUpdatePopup={setShowUpdatePopup}
            type={updateType}
          />
        </Popup>
      </div>
    </>
  );
}

export default InProgressCard;
