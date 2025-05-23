import "../styles/InProgressContainer.css";
import { useState } from "react";
import Popup from "../components/Popup";
import UpdateBook from "./UpdateBook";
import BookInfo from "./BookInfo";

function InProgressCard({ user_book }) {
  const page_count = user_book["book"].page_count;
  const prev_page = user_book.current_page;

  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showBookInfo, setShowBookInfo] = useState(false);

  const [updateType, setUpdateType] = useState("");

  const onClick = (e) => {
    e.preventDefault();
    setUpdateType(e.target.value);
    setShowUpdatePopup(true);
  };

  const handleEditIconClick = (event) => {
    event.preventDefault();
    setShowBookInfo(true);
  };

  return (
    <>
      <div key={user_book.key} className="in-progress-card" >
        <div className="overlay">
          <i onClick={handleEditIconClick} className="fas fa-trash edit-icon"></i>
        </div>
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
        <Popup isOpen={showUpdatePopup} onClose={() => setShowUpdatePopup(false)}>
          <UpdateBook user_book={user_book} setShowUpdatePopup={setShowUpdatePopup} type={updateType} />
        </Popup>
      </div>
      <Popup isOpen={showBookInfo} onClose={() => setShowBookInfo(false)}>
        <BookInfo setShowBookInfo={setShowBookInfo} user_book={user_book}></BookInfo>
        {/* <EditGoalForm goal={goal} setShowEditGoal={setShowEditGoal}></EditGoalForm> */}
      </Popup>
    </>
  );
}

function InProgressContainer({ bookList }) {
  return (
    <div className="in-progress-container">
      <h3>In Progress</h3>
      <div className="bookshelf-in-progress">
        {bookList.map((user_book) => (
          <InProgressCard key={user_book["book"].id} user_book={user_book}></InProgressCard>
        ))}
      </div>
    </div>
  );
}

export default InProgressContainer;
