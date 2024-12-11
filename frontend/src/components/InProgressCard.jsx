import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Popup from "../components/Popup";
import FormInput from "../components/FormInput";
import TimeDropdown from "../components/TimeDropdown";
import Stopwatch from "./Timer";
import { useNavigate } from "react-router-dom";
import "./InProgressCard.css";

function InProgressCard({ user_book }) {
  const book_id = user_book["book"].id;
  const author = user_book.authors?.[0] || "Unknown Author";
  const page_count = user_book["book"].page_count;
  const curr_page = user_book.current_page;
  const progress =
    curr_page > 0 ? Math.floor((curr_page / page_count) * 100) : 0;
  const navigate = useNavigate();
  const user = useUser();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const [time, setTime] = useState(60);
  const [date, setDate] = useState("");
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showTimerPopup, setShowTimerPopup] = useState(false);
  const [showFinishBookButton, setShowFinishBookButton] = useState(false);
  const [pages, setPages] = useState(0);
  const [error, setError] = useState("");
  const [showEnterPagePopup, setShowEnterPagePopup] = useState(false);

  const addSessionMutation = useMutation({
    mutationFn: () =>
      fetch(`http://localhost:8000/sessions/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          user_id: user.id,
          book_id: book_id,
          cur_page: pages,
          minutes: Math.floor(time / 60), // time is in seconds
          created_at: date,
        }),
      }).then((response) => response.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(["books", user.id]);
      navigate("/bookshelf");
    },
  });

  const finishBookMutation = useMutation({
    mutationFn: () =>
      fetch(`http://localhost:8000/user/finish/${book_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then((response) => response.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(["books", user.id]);
      navigate("/bookshelf");
    },
  });

  const finishBook = (e) => {
    e.preventDefault();
    setPages(page_count);
    addSessionMutation.mutate();
    finishBookMutation.mutate();
  };

  const handleTimeChange = (newTime) => {
    setTime(newTime);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSubmitStopwatch = () => {
    const rn = new Date();
    setDate(rn);
    console.log(date);
    setShowEnterPagePopup(true);

    // addSessionMutation.mutate();
  };

  const addDailyStat = (e) => {
    e.preventDefault();

    // Page number entered is less than where the user started
    if (isNaN(pages) || pages < curr_page) {
      setError(
        `Please enter a page number greater than the one you started reading at today,  (pg. ${curr_page})`
      );
      return;
    }
    // Page number entered is greater than amount of pages in book
    if (pages >= page_count) {
      setError(
        `The page number you entered is greater than the amount of pages in the book (${page_count} pages)`
      );
      setShowFinishBookButton(true);
      return;
    }

    setError("");

    addSessionMutation.mutate();
    setShowUpdatePopup(false);
    setShowEnterPagePopup(false);
    setShowTimerPopup(false);
  };

  return (
    <>
      <div key={user_book.key} className="in-progress-card">
        <img height="193" width="128" src={user_book["book"].cover_url}></img>
        <div className="info">
          {/* <div className="book-title">{user_book["book"].title}</div>
          <div className="book-author">{author.name}</div> */}
          <div className="progress">
            <progress value={curr_page} max={page_count}></progress>
          </div>
          <div className="progress-buttons">
            <button
              className="read-button"
              onClick={() => setShowTimerPopup(true)}
            >
              Read
            </button>
            <button
              className="update-button"
              onClick={() => setShowUpdatePopup(true)}
            >
              Update
            </button>
          </div>
        </div>
        <Popup
          isOpen={showUpdatePopup}
          onClose={() => setShowUpdatePopup(false)}
        >
          <form onSubmit={addDailyStat}>
            <FormInput name="Current Page" setter={setPages}></FormInput>
            <TimeDropdown onTimeChange={handleTimeChange}></TimeDropdown>
            <div>
              <label htmlFor="date-picker">Select a Date:</label>
              <input
                type="date"
                id="date-picker"
                value={date}
                onChange={handleDateChange}
                required
              />
            </div>

            <h1>{user_book.book.title}</h1>
            <h3>
              {user_book.current_page} of {user_book.book.page_count} pages
            </h3>
            <button type="submit">Add Session</button>
            {showFinishBookButton && (
              <button type="submit" onClick={finishBook}>
                Finish Book
              </button>
            )}
            {error && <p>{error}</p>}
          </form>
        </Popup>

        <Popup isOpen={showTimerPopup} onClose={() => setShowTimerPopup(false)}>
          <div className="timer-popup">
            <h3>Now Reading</h3>
            <div className="timer-book-info">
              <img
                height="193"
                width="128"
                src={user_book["book"].cover_url}
              ></img>
            </div>
            <Stopwatch time={time} setTime={setTime}></Stopwatch>
            <button onClick={handleSubmitStopwatch}>Done Reading</button>
            <Popup
              isOpen={showEnterPagePopup}
              onClose={() => setShowEnterPagePopup(false)}
            >
              <form onSubmit={addDailyStat}>
                <FormInput
                  name="What page did you get to?"
                  setter={setPages}
                ></FormInput>
                <button type="submit">Add Session</button>
              </form>
            </Popup>
          </div>
        </Popup>
      </div>
    </>
  );
}

export default InProgressCard;
