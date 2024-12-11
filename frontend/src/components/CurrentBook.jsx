import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import "./CurrentBook.css";

function CurrentBook() {
  const user = useUser();
  const { token } = useAuth();

  const { data: current_book, isSuccess } = useQuery({
    queryKey: ["current_book", user.id],
    queryFn: () =>
      fetch(`http://localhost:8000/user/current-book`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then((response) => response.json()),
  });

  return (
    <>
      {current_book && (
        <div class="reading-progress">
          <h2>Now Reading...</h2>
          {/* <h2 class="book-title">{current_book.book.title}</h2> */}
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

        // <div className="current-book horizontal-flex-container">
        //   <div>
        //     <h3>{current_book["book"].title}</h3>
        //     <div>{`${current_book["progress"].cur_page} of ${current_book["book"].page_count} pages`}</div>
        //     <div></div>
        //   </div>

        //   <img src={current_book["book"].cover_url}></img>
        // </div>
      )}
    </>
  );
}

export default CurrentBook;
