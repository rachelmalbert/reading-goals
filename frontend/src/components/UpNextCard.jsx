import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./UpNextCard.css";

function UpNextCard({ user_book }) {
  const author = user_book.authors?.[0] || "Unknown Author";
  const { token } = useAuth();
  const navigate = useNavigate();
  const user = useUser();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      fetch(`http://localhost:8000/user/start/${user_book["book"].id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(user_book["book"].id),
      }).then((response) => response.json()),
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
        <img height="193" width="128" src={user_book["book"].cover_url}></img>
        <div className="info">
          {/* <div className="book-title">{user_book["book"].title}</div>
          <div className="book-author">{author.name}</div> */}
          <button className="start-book-button" onClick={onClick}>
            Start
          </button>
        </div>
      </div>
    </>
  );
}

export default UpNextCard;
