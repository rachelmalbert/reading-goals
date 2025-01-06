import "../styles/UpdateBook.css";
import FormInput from "./FormInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi, useUser } from "../hooks";
import { CurrentDateTime } from "../utils";
import Stopwatch from "./Timer";

const CurrentBookCard = ({ user_book }) => {
  const { current_page } = user_book;
  const { title, page_count, cover_url } = user_book["book"];

  return (
    <div className="current-book">
      <h2>Now Reading</h2>
      <div className="update-book-info">
        <img src={cover_url} alt={`${title} cover`} className="update-book-cover" />
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

function UpdateForm({ addSession, showFinishBookButton, finishBook, error }) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [curPage, setCurPage] = useState(0);

  let today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  today = `${year}-${month}-${day}`;
  const [date, setDate] = useState(today);

  const handleAddSession = (e) => {
    e.preventDefault();
    let time = Number(hours * 60) + Number(minutes);
    addSession(e, time, date, curPage);
  };

  const handleFinishBook = (e) => {
    e.preventDefault();
    let time = Number(hours * 60) + Number(minutes);
    addSession(e, time, date, curPage);
    finishBook(e);
  };

  return (
    <form onSubmit={handleAddSession} className="update-book-form">
      <FormInput type="number" name="What page did you get to?" setter={setCurPage} required />
      <FormInput type="date" name="Date" value={date} setter={setDate} max={today} required />
      <div className="hours-minutes">
        <FormInput type="number" name="Hours" min="0" setter={setHours} className="hours-input" />
        <FormInput type="number" name="Minutes" min="0" max="59" setter={setMinutes} className="minutes-input" />
      </div>
      <button className="add-session-btn" type="submit">
        Add Session
      </button>
      {error && <p>{error}</p>}
      {showFinishBookButton && <button onClick={handleFinishBook}>Finish Book</button>}
    </form>
  );
}

function ReadForm({ addSession, showFinishBookButton, finishBook }) {
  const [time, setTime] = useState(3900);
  const [curPage, setCurPage] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleAddSession = (event) => {
    event.preventDefault();
    let mins = Math.floor(time / 60);
    addSession(event, mins, CurrentDateTime(), curPage);
  };

  const handleFinishBook = (e) => {
    e.preventDefault();
    addSession(e, time, CurrentDateTime(), curPage);
    finishBook(e);
  };

  return (
    <div className="timer-popup">
      <Stopwatch time={time} setTime={setTime} isRunning={isRunning} setIsRunning={setIsRunning}>
        <label htmlFor="curPage"> What page did you get to?</label>
        <input
          id="curPage"
          onChange={(e) => setCurPage(e.target.value)}
          disabled={isRunning}
          className={`page-input ${isRunning ? "disabled" : ""}`}
        ></input>
        <button className={`add-session-btn ${isRunning ? "disabled" : ""}`} type="button" onClick={handleAddSession} disabled={isRunning}>
          Add Session
        </button>
        {showFinishBookButton && <button onClick={handleFinishBook}>Finish Book</button>}
      </Stopwatch>
    </div>
  );
}

function UpdateBook({ user_book, setShowUpdatePopup, type }) {
  const api = useApi();
  const user = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { page_count, id: book_id } = user_book["book"];
  const prev_page = user_book.current_page;

  const [error, setError] = useState("");

  const [showFinishBookButton, setShowFinishBookButton] = useState(false);

  const addSessionMutation = useMutation({
    mutationFn: (newSession) => api.post("/sessions/add", newSession).then((response) => response.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(["books", user.id]);
      // navigate("/bookshelf");
    },
  });

  const finishBookMutation = useMutation({
    mutationFn: () => api.put(`/user_book/finish/${book_id}`, "").then((response) => response.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(["books", user.id]);
      navigate("/bookshelf");
    },
  });

  const addDailyStat = (e, time, dateTime, curPage) => {
    e.preventDefault();

    const newSession = {
      user_id: user.id,
      book_id: book_id,
      cur_page: curPage,
      minutes: Math.floor(time),
      created_at: dateTime,
    };
    // Page number entered is less than where the user started
    if (isNaN(curPage) || curPage <= prev_page) {
      setError(`Please enter a page number greater than the one you started reading at today,  (pg. ${prev_page})`);
      return;
    }
    // Page number entered is greater than amount of pages in book
    if (curPage >= page_count && !showFinishBookButton) {
      setError(`The page number you entered is greater than the amount of pages in the book (${page_count} pages)`);
      setShowFinishBookButton(true);
      return;
    }

    setError("");
    addSessionMutation.mutate(newSession);
    setShowUpdatePopup(false);
  };

  const finishBook = (e) => {
    e.preventDefault();
    // addDailyStat(e, time, dateTime, page_count);
    finishBookMutation.mutate();
    setShowFinishBookButton(false);
  };

  return (
    <div className="update-popup">
      <CurrentBookCard user_book={user_book}></CurrentBookCard>
      {type === "update" && (
        <UpdateForm addSession={addDailyStat} showFinishBookButton={showFinishBookButton} finishBook={finishBook} error={error} />
      )}
      {type === "read" && <ReadForm addSession={addDailyStat} />}
    </div>
  );
}
export default UpdateBook;
