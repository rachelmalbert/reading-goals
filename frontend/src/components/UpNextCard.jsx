import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser, useApi } from "../hooks";
import { useNavigate } from "react-router-dom";

import "../styles/UpNextCard.css";

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
        <img className="book-cover-img" src={user_book["book"].cover_url} alt="book cover"></img>
        <div className="info">
          <button className="start-book-button" onClick={onClick}>
            Start
          </button>
        </div>
      </div>
    </>
  );
}

export default UpNextCard;
