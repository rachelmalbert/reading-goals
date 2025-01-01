function CurrentDateTime() {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${currentDate
    .getDate()
    .toString()
    .padStart(2, "0")} ${currentDate.getHours().toString().padStart(2, "0")}:${currentDate.getMinutes().toString().padStart(2, "0")}:${currentDate
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;

  return formattedDate;
}

function MinsToHours(mins) {
  let minutes = mins % 60;
  let hours = Math.floor(mins / 60);
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}h ${minutes}m`;
}

const yearMonthDay = () => {
  const date = new Date();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // const month = months[date.getMonth()];
  const dayOfMonth = date.getDate();

  const suffix = (dayOfMonth) => {
    if (dayOfMonth > 3 && dayOfMonth < 21) return "th";
    switch (dayOfMonth % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const year = () => {
    return date.getFullYear();
  };

  const month = () => {
    return months[date.getMonth()];
  };

  const day = () => {
    return `${days[date.getDay()]}`;
  };

  return { year, month, day };
  // return [`${date.getFullYear}`, `${month}`, `${month} ${dayOfMonth}${suffix(dayOfMonth)}`];
};

export { CurrentDateTime, yearMonthDay };
