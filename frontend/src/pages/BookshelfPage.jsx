import "../styles/BookshelfPage.css";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useUser, useApi } from "../hooks";
import { Link, useNavigate } from "react-router-dom";
import UpNextContainer from "../components/UpNextContainer";
import InProgressContainer from "../components/InProgressContainer";
import FinishedContainer from "../components/FinishedContainer";

function BookshelfPage() {
  const user = useUser();
  const api = useApi();
  const navigate = useNavigate();

  const {
  data,
  isLoading,
  isFetching,
} = useQuery({
  queryKey: ["books", user.id],
  queryFn: () => api.get("/user_book/books").then((response) => response.json()),
});

useEffect(() => {
  // Wait until data is fetched
  if (!isLoading && !isFetching && data && data.length === 0) {
    navigate("/search");
  }
}, [data, isLoading, isFetching]);

  if (data && data.length > 0) {
    const inProgressBooks = data.filter((book) => book.status === "in progress");
    const upNextBooks = data.filter((book) => book.status === "up next");
    const finishedBooks = data.filter((book) => book.status === "finished").reverse();
    return (
      <div className="bookshelf">
        <div className="bookshelf-content">
          <h2 className="mobile-title">My Bookshelf</h2>
          <div className="bookshelf-left">
            <InProgressContainer bookList={inProgressBooks}></InProgressContainer>
            <UpNextContainer bookList={upNextBooks}></UpNextContainer>
          </div>
          <div className="bookshelf-right">
            <FinishedContainer bookList={finishedBooks}></FinishedContainer>
          </div>
        </div>
      </div>
    );
  } else {
  }
}
export default BookshelfPage;
