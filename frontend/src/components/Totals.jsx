import "../styles/Totals.css";
import { useQuery } from "@tanstack/react-query";
import { useUser, useApi } from "../hooks";

import books from "../assets/images/books.png";
import pages from "../assets/images/pages.png";
import hourglass from "../assets/images/hourglass.png";

function Totals() {
  const user = useUser();
  const api = useApi();

  const { data, isLoading } = useQuery({
    queryKey: ["totals", user.id],
    queryFn: () => api.get("/stats").then((response) => response.json()),
  });

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {data && (
        <div className="totals-container">
          <div className="total-card">
            <div className="card-left">
              <p className="title">Total Books</p>
              <p className="amount">{data.total_books}</p>
            </div>
            <div className="card-icon">
              <img src={books} alt="books icon" />
            </div>
          </div>
          <div className="total-card">
            <div className="card-left">
              <p className="title">Total Minutes</p>
              <p className="amount">{data.total_minutes}</p>
            </div>
            <div className="card-icon">
              <img src={hourglass} alt="hourglass icon" />
            </div>
          </div>
          <div className="total-card">
            <div className="card-left">
              <p className="title">Total Pages</p>
              <p className="amount">{data.total_pages}</p>
            </div>
            <div className="card-icon">
              <img src={pages} alt="pages icon" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Totals;
