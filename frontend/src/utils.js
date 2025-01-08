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

const yearMonthDay = () => {
  const date = new Date();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
};

export { CurrentDateTime, yearMonthDay };
