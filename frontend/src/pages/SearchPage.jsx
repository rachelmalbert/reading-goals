import "../styles/SearchPage.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useUser, useApi } from "../hooks";
import { useState } from "react";
import FormInput from "../components/FormInput";

function AddBook({ book }) {
  const api = useApi();
  const user = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => api.post(`/user_book/checkout/${book.id}`, book.id).then((response) => response.json()),
    onSuccess: () => {
      console.log("Book checked out successfully!");
      queryClient.invalidateQueries(["books", user.id]);
      navigate("/bookshelf");
    },
  });

  const onClick = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <button className="add-book-btn" onClick={onClick}>
      Add To Bookshelf
    </button>
  );
}

function SearchResultCard({ book }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const firstAuthor = book.authors && book.authors.length > 0 ? book.authors[0] : "Unknown Author";
  const pages = book.page_count ? book.page_count + " pages" : "";

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="search-book-card">
      <img className="book-cover-img" src={book.cover_url} alt={book.title} />
      <div className="book-info">
        <h2 className="book-title">{book.title}</h2>
        <h3 className="book-author">
          {firstAuthor} - {pages}
        </h3>
        <AddBook book={book} />
        <div className="book-description-container">
          <div className={`book-description ${isExpanded ? "expanded" : ""}`}>
            {book.description && book.description}
            {!book.description && <>No Description</>}
          </div>
          {book.description && (
            <p className="read-more-button" onClick={toggleDescription}>
              {isExpanded ? " Less" : "More"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const api = useApi();
  const [error, setError] = useState("");

  const { data } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () =>
      api.get(`/books/google/${searchQuery}`).then((response) => {
        if (!response.ok) {
          console.log("ERRA");
          setError("Error fetching from google api");
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          setError("");
          return response.json();
        }
      }),
    enabled: !!searchQuery,
    retry: false,
  });
  // <div className={`error-message ${error === "" ? "" : "error"}`}>{error}</div>;

  // if (isLoading) {
  //   return <p className="loading">Loading...</p>;
  // } else {
  return (
    <div className="search-page">
      <div className="sticky-section">
        <Link to="/bookshelf" className="back-link">
          X
        </Link>
        <h1 className="page-title">Search For A Book</h1>
        <div className="search-bar">
          <FormInput setter={setSearchQuery} />
          <button className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

      {data && <div className="books-list">{data["books"] && data["books"].map((book) => <SearchResultCard key={book.id} book={book} />)}</div>}
      <div className={`error-message ${error === "" ? "" : "error"}`}>{error}</div>
    </div>
  );
}
// }

export default SearchPage;
