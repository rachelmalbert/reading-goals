import { useQuery } from "@tanstack/react-query";
// import { useUser } from "../context/UserContext";
import { useUser, useApi } from "../hooks";
// import { useAuth } from "../context/AuthContext";
import "../styles/Sessions.css";
import { use } from "react";

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  return `${date.toLocaleString("default", {
    month: "short",
  })} ${day}, ${date.getFullYear()}`;
}

function SessionItem({ session }) {
  const { api } = useApi();

  const { data: bookData, isLoading } = useQuery({
    queryKey: ["book", session.book_id],
    queryFn: () =>
      api.get(`/books/${session.book_id}`).then((response) => response.json()),
  });

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
  const api = useApi();

  const { data, isLoading } = useQuery({
    queryKey: ["sessions", user.id],
    queryFn: () => api.get("/sessions").then((response) => response.json()),
  });

  return (
    <>
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
