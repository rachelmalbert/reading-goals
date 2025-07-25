import "../styles/Sessions.css";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../hooks";

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getUTCDate();
  return `${date.toLocaleString("default", {
    month: "short",
  })} ${day}, ${date.getFullYear()}`;
}

function SessionItem({ session }) {
  const api = useApi();

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

function Sessions() {
  const api = useApi();

  const { data: dates } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => api.get("/sessions").then((response) => response.json()),
    enabled: true,
  });

  if (dates) {
    console.log(dates);
    console.log(dates.length);
  }

  return (
    <>
      {dates && (
        <div className={`reading-sessions-container-${Object.keys(dates).length === 0 ? "invisible" : "visible"}`}>
          <h3 className="sessions-title">Reading Sessions</h3>
          <div className="sessions">
            {Object.entries(dates).map(([date, sessions]) => (
              <div className="date-section" key={date}>
                <h4 className="session-date">{formatDate(date)}</h4>
                <ul className="session-list">
                  {[...sessions]
                  .sort((a, b) => b.id - a.id) // Sort sessions by ascending ID
                  .map((session) => (
                    <SessionItem key={session.id} session={session} />
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
