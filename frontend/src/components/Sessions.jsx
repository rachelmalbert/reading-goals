import { useQuery } from "@tanstack/react-query";
import { useApi } from "../hooks";
import "../styles/Sessions.css";

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getUTCDate();
  return `${date.toLocaleString("default", {
    month: "short",
  })} ${day}, ${date.getFullYear()}`;
}

function SessionItem({ session }) {
  const api = useApi();
  console.log(session.created_at);
  console.log("session", session.book_id);
  const queryKey = [session.book_id]; // Unique key based on book_id
  console.log("queryKey:", queryKey);

  // Query to fetch book data by book_id
  const { data } = useQuery({
    queryKey: [session.book_id],
    queryFn: () => api.get(`/books/${session.book_id}`).then((response) => response.json()),
    enabled: true,
  });

  if (data) {
    console.log("bookData", data);
  }

  return (
    <li className="session-item">
      {/* <div className="session-title">{data && data.title}</div> */}
      <img className="session-img" src={data && data.cover_url} alt="book cover"></img>
      <div className="session-details">
        <p>
          p. {session.prev_page} - {session.cur_page}{" "}
        </p>
        <p> {session.minutes} mins</p>
      </div>
    </li>
  );
}
// }

function Sessions() {
  const api = useApi();

  const { data: dates } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => api.get("/sessions").then((response) => response.json()),
    enabled: true,
  });

  return (
    <>
      {dates && (
        <div className="reading-sessions-container">
          <h3 className="sessions-title">Reading Sessions</h3>
          <div className="sessions">
            {Object.entries(dates).map(([date, sessions]) => (
              <div className="date-section" key={date}>
                <h4 className="session-date">{formatDate(date)}</h4>
                <ul className="session-list">
                  {sessions.map((session) => (
                    <SessionItem key={session.id} session={session}></SessionItem>
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
