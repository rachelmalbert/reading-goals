import React, { useState, useEffect } from "react";
import "./Timer.css";

function Stopwatch({ time, setTime }) {
  // State to store elapsed time in seconds
  //   const [time, setTime] = useState(60);
  // State to track if the stopwatc is running or paused
  const [isRunning, setIsRunning] = useState(false);

  // Start/Stop the stopwatch when the button is clicked
  const toggleStopwatch = () => {
    setIsRunning((prev) => !prev);
  };

  // Reset the stopwatch to 0
  const resetStopwatch = () => {
    setIsRunning(false); // Stop the stopwatch
    setTime(0); // Reset time to 0
  };

  // Effect to update the stopwatch time every second
  useEffect(() => {
    let interval;

    // If the stopwatch is running, update the time every second
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000); // Update every second
    } else {
      clearInterval(interval); // Clear the interval when paused
    }

    // Cleanup the interval when the component is unmounted or isRunning changes
    return () => clearInterval(interval);
  }, [isRunning]);

  // Format time as minutes:seconds
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    let remaining_seconds = time - hours * 3600;
    const minutes = Math.floor(remaining_seconds / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    // <div style={{ textAlign: "center" }}>
    //   <div>
    //     <p style={{ fontSize: "2rem" }}>{formatTime(time)}</p>
    //     <button onClick={toggleStopwatch} style={{ margin: "10px" }}>
    //       {isRunning ? "Pause" : "Start"}
    //     </button>
    //     <button onClick={resetStopwatch} style={{ margin: "10px" }}>
    //       Reset
    //     </button>
    //     {/* <button onClick={handleSubmitStopwatch} style={{ margin: "10px" }}>
    //       Submit
    //     </button> */}
    //   </div>
    // </div>

    <div class="timer-container">
      <div class="clock" id="clock">
        00:00
      </div>
      <div class="buttons">
        <button class="start-btn" id="startBtn">
          Start
        </button>
        <button class="stop-reset-btn" id="stopResetBtn">
          Stop / Reset
        </button>
      </div>
    </div>
  );
}

export default Stopwatch;
