import React, { useEffect } from "react";
import "../styles/Timer.css";

function Stopwatch({ time, setTime, isRunning, setIsRunning, children }) {
  const toggleStopwatch = () => {
    setIsRunning((prev) => !prev);
  };

  const resetStopwatch = () => {
    setIsRunning(false);
    setTime(0);
  };

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    let remaining_seconds = time - hours * 3600;
    const minutes = Math.floor(remaining_seconds / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="stopwatch-container">
      <div className="time-display">
        <p>{formatTime(time)}</p>
      </div>
      <div className="button-group">
        <button onClick={toggleStopwatch} className={`btn ${isRunning ? "pause" : "start"}`}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={resetStopwatch} className="btn reset">
          Reset
        </button>
      </div>
      {children}
    </div>
  );
}

{
  /* <button onClick={handleSubmitStopwatch} style={{ margin: "10px" }}>
          Submit
        </button> */
}

// function TimerPopup({}) {
//   return (
//     <Popup isOpen={showTimerPopup} onClose={() => setShowTimerPopup(false)}>
//       <div className="timer-popup">
//         <h3>Now Reading</h3>
//         <div className="timer-book-info">
//           <img height="193" width="128" src={user_book["book"].cover_url}></img>
//         </div>
//         <Stopwatch time={time} setTime={setTime}></Stopwatch>
//         <button onClick={handleSubmitStopwatch}>Done Reading</button>
//         <Popup
//           isOpen={showEnterPagePopup}
//           onClose={() => setShowEnterPagePopup(false)}
//         >
//           <form onSubmit={addDailyStat}>
//             <FormInput
//               name="What page did you get to?"
//               setter={setPages}
//             ></FormInput>
//             <button type="submit">Add Session</button>
//           </form>
//         </Popup>
//       </div>
//     </Popup>
//   );
// }

export default Stopwatch;
