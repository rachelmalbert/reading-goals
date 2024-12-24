import { useQuery } from "@tanstack/react-query";
import { useApi, useUser } from "../hooks";
import "../styles/NowReadingCard.css";

function NowReadingCard() {
  const api = useApi();
  const user = useUser();

  const { data: current_book } = useQuery({
    queryKey: ["current_book", user.id],
    queryFn: () =>
      api.get("/user/current-book").then((response) => response.json()),
  });

  return (
    <>
      {current_book && (
        <div class="now-reading-container">
          <h2>Now Reading...</h2>
          <img
            src={current_book.book.cover_url}
            alt="Book Cover"
            class="current-book-cover"
          />
          <div class="page-progress">
            Page {current_book.progress.cur_page} of{" "}
            {current_book.book.page_count}
          </div>
          <button class="continue-btn">Continue Reading</button>
        </div>
      )}
    </>
  );
}

export default NowReadingCard;
