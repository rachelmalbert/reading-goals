import "../styles/FinishedBookCard.css";

function FinishedBookCard({ user_book }) {
  const author = user_book.authors?.[0] || "Unknown Author";
  return (
    <>
      <div key={user_book.key} className="finished-book-card">
        <img className="book-cover-img" src={user_book["book"].cover_url}></img>
        <div className="book-title">{user_book["book"].title}</div>
        <div className="book-author">{author.name}</div>
      </div>
    </>
  );
}

export default FinishedBookCard;
