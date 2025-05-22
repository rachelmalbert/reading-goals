import "../styles/UpNextContainer.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser, useApi } from "../hooks";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function AddBookCard({ url }) {
  const navigate = useNavigate();
  return (
    <div className="add-book-card">
      <div>
        <i className="fas fa-plus"></i>
      </div>
      <button onClick={() => navigate("/search")} className="add-book-button">
        Add Book
      </button>
    </div>
  );
}

function UpNextCard({ user_book }) {
  const navigate = useNavigate();
  const api = useApi();
  const user = useUser();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => api.put(`/user_book/start/${user_book["book"].id}`, user_book["book"].id).then((response) => response.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(["books", user.id]);
      navigate("/bookshelf");
    },
  });

  const onClick = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <>
      <div key={user_book.key} className="up-next-card">
        {/* <div className="image-container"> */}
        <img className="book-cover-img" src={user_book["book"].cover_url} alt="book cover"></img>
        {/* </div> */}
        <button className="start-book-button" onClick={onClick}>
          Start
        </button>
      </div>
    </>
  );
}

function UpNextContainer({ bookList }) {
  return (
    <div className="up-next-container">
      <h3>Up Next</h3>
      <div className="up-next-list">
        <AddBookCard url="/search"></AddBookCard>
        {bookList.map((user_book) => (
          <UpNextCard key={user_book["book"].id} user_book={user_book}></UpNextCard>
        ))}
      </div>
    </div>
  );
}

export default UpNextContainer;
