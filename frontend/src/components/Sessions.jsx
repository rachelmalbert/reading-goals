import { useQuery } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import "./Sessions.css";

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  return `${date.toLocaleString("default", {
    month: "short",
  })} ${day}, ${date.getFullYear()}`;
}

function minsToHours(mins) {
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

function SessionItem({ session }) {
  const { token } = useAuth();
  const { data: bookData, isLoading } = useQuery({
    queryKey: ["book", session.book_id],
    queryFn: () =>
      fetch(`http://localhost:8000/books/${session.book_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then((response) => response.json()),
  });

  if (isLoading) return <p>Loading book info...</p>;

  return (
    <li className="session-item">
      <div className="session-title">{bookData && bookData.title}</div>
      <div className="session-details">
        Pages: {session.prev_page} - {session.cur_page}, Time: {session.minutes}{" "}
        mins
      </div>
    </li>
  );
}

function Sessions() {
  const user = useUser();
  const { token } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["sessions", user.id],
    queryFn: () =>
      fetch(`http://localhost:8000/sessions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then((response) => response.json()),
  });

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {data && (
        <div className="reading-sessions-container">
          <h3 className="sessions-title">Reading Sessions</h3>
          <div className="sessions">
            {Object.entries(data).map(([date, sessions]) => (
              <div className="date-section" key={date}>
                <h4 className="session-date">{formatDate(date)}</h4>
                <ul className="session-list">
                  {sessions.map((session) => (
                    <SessionItem key={session.created_at} session={session} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Sessions;
