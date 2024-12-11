import React, { useState } from "react";

function TimeDropdown({ onTimeChange }) {
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const hours = Array.from({ length: 12 }, (_, i) => i); // Hours from 0 to 11
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // Minutes from 0 to 55 in increments of 5

  const handleHourChange = (event) => {
    const newHour = parseInt(event.target.value, 10); // Parse the new hour
    setSelectedHour(newHour);
    // onTimeChange(newHour, selectedMinute); // Pass the new hour
    const seconds = newHour * 3600 + selectedMinute * 60;
    onTimeChange(seconds);
  };

  const handleMinuteChange = (event) => {
    const newMinute = parseInt(event.target.value, 10); // Parse the new minute
    setSelectedMinute(newMinute);
    // onTimeChange(selectedHour, newMinute); // Pass the new minute
    const seconds = selectedHour * 3600 + newMinute * 60;
    onTimeChange(seconds);
  };

  return (
    <div>
      <label htmlFor="hours">Hours:</label>
      <select id="hours" value={selectedHour} onChange={handleHourChange}>
        <option value="">Select Hour</option>
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}
          </option>
        ))}
      </select>

      <label htmlFor="minutes">Minutes:</label>
      <select id="minutes" value={selectedMinute} onChange={handleMinuteChange}>
        <option value="">Select Minute</option>
        {minutes.map((minute) => (
          <option key={minute} value={minute}>
            {minute}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TimeDropdown;
