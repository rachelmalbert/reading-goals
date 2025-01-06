import { useQuery } from "@tanstack/react-query";
import { useUser, useApi } from "../hooks";
import InProgressCard from "../components/InProgressCard";
import UpNextCard from "../components/UpNextCard";
import FinishedBookCard from "../components/FinishedBookCard";
import "./BookshelfPage.css";
import { Link } from "react-router-dom";

function AddBookCard({ url }) {
  return (
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
  );
}

function BookshelfPage() {
  const user = useUser();
  const api = useApi();

  const { data } = useQuery({
    queryKey: ["books", user.id],
    queryFn: () => api.get("/user_book/books").then((response) => response.json()),
  });

  if (data) {
    const inProgressBooks = data.filter((book) => book.status === "in progress");
    const upNextBooks = data.filter((book) => book.status === "up next");
    const finishedBooks = data.filter((book) => book.status === "finished").reverse();
    return (
      <div className="bookshelf">
        <div className="bookshelf-content">
          <div className="bookshelf-left">
            {/* In Progress */}
            <h3>In Progress</h3>
            <div className="bookshelf-in-progress">
              {inProgressBooks.map((user_book) => (
                <InProgressCard key={user_book["book"].id} user_book={user_book}></InProgressCard>
              ))}
            </div>
            {/* Up Next */}
            <h3>Up Next</h3>
            <div className="bookshelf-up-next">
              <AddBookCard url="/search"></AddBookCard>
              {upNextBooks.map((user_book) => (
                <UpNextCard key={user_book["book"].id} user_book={user_book}></UpNextCard>
              ))}
            </div>
          </div>
          <div className="bookshelf-right">
            {/* Finished */}

            <h3>
              Finished
              <i className="fa-solid fa-square-check checkmark"></i>
            </h3>
            {finishedBooks.map((user_book) => (
              <FinishedBookCard key={user_book["book"].id} user_book={user_book}></FinishedBookCard>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return <AddBookCard url="/search"></AddBookCard>;
  }
}
export default BookshelfPage;
