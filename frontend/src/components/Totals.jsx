import "./Totals.css";
import "..";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";

import books from "../assets/images/books.png";
import pages from "../assets/images/pages.png";
import hourglass from "../assets/images/hourglass.png";

function Totals() {
  const user = useUser();
  const { token } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["totals", user.id],
    queryFn: () =>
      fetch(`http://localhost:8000/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then((response) => response.json()),
  });
  //   console.log("data!", data);
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
