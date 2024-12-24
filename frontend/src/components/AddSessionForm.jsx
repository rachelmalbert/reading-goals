import "../styles/AddSessionForm.css";
import FormInput from "./FormInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi, useUser } from "../hooks";
import { CurrentDateTime } from "../utils";
import Popup from "./Popup";
import Stopwatch from "./Timer";

const CurrentBook = ({ user_book }) => {
  const { current_page } = user_book;
  const { title, page_count, cover_url } = user_book["book"];

  return (
    <div className="current-book">
      <h2>Now Reading</h2>
      <div className="book-info">
        <img src={cover_url} alt={`${title} cover`} className="book-cover" />
        <div className="book-details">
          <h3>{title}</h3>
          <p>
            Page {current_page} of {page_count}
          </p>
        </div>
      </div>
    </div>
  );
};

function UpdateForm({ onSubmit, user_book, setCurPage, children, error }) {
  return (
    <form onSubmit={onSubmit}>
      <FormInput
        type="number"
        name="Current Page"
        setter={setCurPage}
        required
      ></FormInput>
      <FormInput type="date" name="Date" required></FormInput>
      <FormInput type="number" name="Hours" min="0"></FormInput>
      <FormInput type="number" name="Minutes" min="0" max="59"></FormInput>

      <button type="submit">Add Session</button>
      {children}
      {error && <p>{error}</p>}
    </form>
  );
}

function ReadForm({ onSubmit, user_book, time, setTime, setCurPage }) {
  const [showEnterPagePopup, setShowEnterPagePopup] = useState(false);
  const [showTimerPopup, setShowTimerPopup] = useState(false);

  const handleSubmitStopwatch = () => {
    setShowEnterPagePopup(true);
  };

  return (
    <div className="timer-popup">
      <Stopwatch time={time} setTime={setTime}></Stopwatch>
      <button onClick={handleSubmitStopwatch}>Done Reading</button>
      <Popup
        isOpen={showEnterPagePopup}
        onClose={() => setShowEnterPagePopup(false)}
      >
        <form
          onSubmit={
            (onSubmit,
            () => setShowEnterPagePopup(false),
            () => setShowTimerPopup(false))
          }
        >
          <FormInput
            name="What page did you get to?"
            setter={setCurPage}
          ></FormInput>
          <button type="submit">Add Session</button>
        </form>
      </Popup>
    </div>
  );
}

function AddSessionForm({ user_book, setShowUpdatePopup, type }) {
  const api = useApi();
  const user = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const prev_page = user_book.current_page;
  const book_id = user_book["book"].id;

  const [time, setTime] = useState(60);
  const page_count = user_book["book"].page_count;
  console.log("pagecount", page_count);
  const [error, setError] = useState("");

  const [showFinishBookButton, setShowFinishBookButton] = useState(false);
  const [curPage, setCurPage] = useState(0);

  const newSession = {
    user_id: user.id,
    book_id: book_id,
    cur_page: curPage,
    minutes: Math.floor(time / 60), // time is in seconds
    created_at: CurrentDateTime(),
  };

  const addSessionMutation = useMutation({
    mutationFn: () =>
      api.post("/sessions/add", newSession).then((response) => response.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(["books", user.id]);
      navigate("/bookshelf");
    },
  });

  const finishBookMutation = useMutation({
    mutationFn: () =>
      api
        .put(`/user/finish/${book_id}`, "")
        .then((response) => response.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(["books", user.id]);
      navigate("/bookshelf");
    },
  });

  const finishBook = (e) => {
    e.preventDefault();
    setCurPage(page_count);
    addSessionMutation.mutate();
    finishBookMutation.mutate();
  };

  const addDailyStat = (e) => {
    e.preventDefault();

    // Page number entered is less than where the user started
    if (isNaN(curPage) || curPage < prev_page) {
      setError(
        `Please enter a page number greater than the one you started reading at today,  (pg. ${prev_page})`
      );
      return;
    }
    // Page number entered is greater than amount of pages in book
    if (curPage >= page_count) {
      setError(
        `The page number you entered is greater than the amount of pages in the book (${page_count} pages)`
      );
      setShowFinishBookButton(true);
      return;
    }

    setError("");

    addSessionMutation.mutate();
    setShowUpdatePopup(false);
    // setShowEnterPagePopup(false);
    // setShowTimerPopup(false);
  };

  function FinishBookButton() {
    return (
      <>
        {showFinishBookButton && (
          <button type="submit" onClick={finishBook}>
            Finish Book
          </button>
        )}
      </>
    );
  }

  return (
    <div className="update-popup">
      <CurrentBook user_book={user_book}></CurrentBook>
      {type == "update" && (
        <UpdateForm
          onSubmit={addDailyStat}
          user_book={user_book}
          setTime={setTime}
          setCurPage={setCurPage}
          error={error}
        />
      )}

      {type == "read" && (
        <ReadForm
          onSubmit={addDailyStat}
          user_book={user_book}
          time={time}
          setTime={setTime}
          setCurPage={setCurPage}
        />
      )}
      <FinishBookButton></FinishBookButton>
    </div>
  );

  if (type == "update") {
    return (
      <div>
        <CurrentBook user_book={user_book}></CurrentBook>
        <UpdateForm
          onSubmit={addDailyStat}
          user_book={user_book}
          setTime={setTime}
          setCurPage={setCurPage}
          error={error}
        >
          <FinishBookButton></FinishBookButton>
        </UpdateForm>
      </div>
    );
  } else {
    return (
      <div>
        <CurrentBook user_book={user_book}></CurrentBook>

        <ReadForm
          onSubmit={addDailyStat}
          user_book={user_book}
          time={time}
          setTime={setTime}
          setCurPage={setCurPage}
        >
          <FinishBookButton></FinishBookButton>
        </ReadForm>
      </div>
    );
  }
}
export default AddSessionForm;
