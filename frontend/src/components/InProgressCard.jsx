import { useState } from "react";
import Popup from "../components/Popup";
import "../styles/InProgressCard.css";
import AddSessionForm from "./AddSessionForm";

function InProgressCard({ user_book }) {
  const page_count = user_book["book"].page_count;
  const prev_page = user_book.current_page;

  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showTimerPopup, setShowTimerPopup] = useState(false);

  return (
    <>
      <div key={user_book.key} className="in-progress-card">
        <img className="book-cover-img" src={user_book["book"].cover_url}></img>
        <div className="info">
          <div className="progress">
            <progress value={prev_page} max={page_count}></progress>
          </div>
          <div className="progress-buttons">
            <button
              className="read-button"
              onClick={() => setShowTimerPopup(true)}
            >
              Read
            </button>
            <button
              className="update-button"
              onClick={() => setShowUpdatePopup(true)}
            >
              Update
            </button>
          </div>
        </div>
        <Popup
          isOpen={showUpdatePopup}
          onClose={() => setShowUpdatePopup(false)}
        >
          <AddSessionForm
            user_book={user_book}
            setShowUpdatePopup={setShowUpdatePopup}
            type="update"
          />
        </Popup>

        <Popup isOpen={showTimerPopup} onClose={() => setShowTimerPopup(false)}>
          <AddSessionForm
            user_book={user_book}
            setShowUpdatePopup={setShowUpdatePopup}
            type="read"
          ></AddSessionForm>
        </Popup>
      </div>
    </>
  );
}

export default InProgressCard;
