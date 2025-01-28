import "../styles/FinishedContainer.css";

function FinishedCard({ user_book }) {
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
