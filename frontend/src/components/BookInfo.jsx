import "../styles/BookInfo.css";

import React, { useState } from "react";

// Simple BookInfo Component
const BookInfo = ({ user_book }) => {
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const author = user_book.authors?.[0] || "Unknown Author";

  // Function to confirm deletion
  const handleDelete = () => {
    setShowDeletePrompt(true);
  };

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle the actual deletion
  const confirmDelete = () => {
    // onDelete(book.id);
    // Call the onDelete function passed down as prop
    setShowDeletePrompt(false);
  };

  // Cancel the delete action
  const cancelDelete = () => {
    setShowDeletePrompt(false);
  };

  return (
    <div className="book-info-container">
      <div className="book-info-card">
        <img className="book-cover-img" src={user_book.book.cover_url} alt={user_book.book.title} />
        <div className="book-info">
          <h2 className="book-info-title">{user_book.book.title}</h2>
          <h3 className="book-into-author">
            {author.name} - {user_book.book.page_count}
          </h3>
          {/* <AddBook book={book} /> */}
          {/* <div className="book-description-container"> */}
          <div className={`book-info-description`}>
            {/* <div className={`book-description ${isExpanded ? "expanded" : ""} clamp`}> */}
            {user_book.book.description && user_book.book.description}
            {/* {!book.description && <>No Description</>} */}
          </div>
          {/* {user_book.book.description && (
              <p className="read-more-button" onClick={toggleDescription}>
                {isExpanded ? " Less" : "More"}
              </p>
            )} */}
        </div>
      </div>
      {/* </div> */}
      {/* Delete Button */}
      <button className="delete-btn" onClick={handleDelete}>
        Delete from Library
      </button>

      {/* Delete Confirmation Prompt */}
      {showDeletePrompt && (
        <div className="delete-prompt">
          <p>Are you sure you want to delete this book from your library?</p>
          <button className="confirm-btn" onClick={confirmDelete}>
            Yes, delete it
          </button>
          <button className="cancel-btn" onClick={cancelDelete}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default BookInfo;
