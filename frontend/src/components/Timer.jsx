import "../styles/Timer.css";
import React, { useEffect } from "react";

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
export default Stopwatch;
