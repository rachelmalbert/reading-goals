import { useQuery } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import InProgressCard from "../components/InProgressCard";
import UpNextCard from "../components/UpNextCard";
import FinishedCard from "../components/FinishedCard";
import "./BookshelfPage.css";
import { Link } from "react-router-dom";

function AddBookCard() {
  return (
    <div className="add-book-card">
      <div className="plus-icon">
        <i className="fas fa-plus"></i> {/* Font Awesome "+" Icon */}
      </div>
      <div className="info">
        <Link to="/search">
          <button className="add-book-button">Add Book</button>
        </Link>
        {/* <p>ADD BOOK</p> */}
      </div>
    </div>
  );
}

function BookshelfPage() {
  const user = useUser();
  const { token } = useAuth();

  const { data } = useQuery({
    queryKey: ["books", user.id],
    queryFn: () =>
      fetch("http://localhost:8000/user/books", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then((response) => response.json()),
  });

  if (data) {
    const inProgressBooks = data.filter(
      (book) => book.status === "in progress"
    );
    const upNextBooks = data.filter((book) => book.status === "up next");
    const finishedBooks = data.filter((book) => book.status === "finished");
    return (
      <div className="bookshelf">
        <div className="bookshelf-content">
          <div className="bookshelf-left">
            {/* In Progress */}
            <h3>In Progress</h3>
            <div className="bookshelf-in-progress">
              {inProgressBooks.map((user_book) => (
                <InProgressCard
                  key={user_book["book"].id}
                  user_book={user_book}
                ></InProgressCard>
              ))}
            </div>
            {/* Up Next */}
            <h3>Up Next</h3>
            <div className="bookshelf-up-next">
              <AddBookCard></AddBookCard>
              {upNextBooks.map((user_book) => (
                <UpNextCard
                  key={user_book["book"].id}
                  user_book={user_book}
                ></UpNextCard>
              ))}
            </div>
          </div>
          <div className="bookshelf-right">
            {/* Finished */}
            <h3>Finished </h3>
            {finishedBooks.map((user_book) => (
              <FinishedCard
                key={user_book["book"].id}
                user_book={user_book}
              ></FinishedCard>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return <AddBookCard></AddBookCard>;
  }
}
export default BookshelfPage;
