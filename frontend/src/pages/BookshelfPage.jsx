import "../styles/BookshelfPage.css";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useUser, useApi } from "../hooks";
import { Link, useNavigate } from "react-router-dom";
// import InProgressCard from "../components/InProgressCard";
// import UpNextCard from "../components/UpNextCard";
import UpNextContainer from "../components/UpNextContainer";
import InProgressContainer from "../components/InProgressContainer";
import FinishedContainer from "../components/FinishedContainer";

// function AddBookCard({ url }) {
//   return (
//     <div className="add-book-card">
//       <Link to={url}>
//         <div>Add Book</div> <i className="fas fa-plus"></i>
//       </Link>
//     </div>
//   );
// }

// function UpNextContainer({ bookList }) {
//   return (
//     <div className="up-next-container">
//       <h3>Up Next</h3>
//       <div className="bookshelf-up-next">
//         <AddBookCard url="/search"></AddBookCard>
//         {bookList.map((user_book) => (
//           <UpNextCard key={user_book["book"].id} user_book={user_book}></UpNextCard>
//         ))}
//       </div>
//     </div>
//   );
// }

// function InProgressContainer({ bookList }) {
//   return (
//     <div className="in-progress-container">
//       <h3>In Progress</h3>
//       <div className="bookshelf-in-progress">
//         {bookList.map((user_book) => (
//           <InProgressCard key={user_book["book"].id} user_book={user_book}></InProgressCard>
//         ))}
//       </div>
//     </div>
//   );
// }

// function FinishedContainer({ bookList }) {
//   return (
//     <div className="finished-container">
//       <h3>
//         Finished
//         <i className="fa-solid fa-square-check checkmark"></i>
//       </h3>
//       {bookList.map((user_book) => (
//         <FinishedBookCard key={user_book["book"].id} user_book={user_book}></FinishedBookCard>
//       ))}
//     </div>
//   );
// }

function BookshelfPage() {
  const user = useUser();
  const api = useApi();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["books", user.id],
    queryFn: () => api.get("/user_book/books").then((response) => response.json()),
  });

  console.log("data", data)


  useEffect(() => {
    if (data && data.length === 0) {
      navigate("/search");
    }
  }, [data]);

  if (data && data.length > 0) {
    const inProgressBooks = data.filter((book) => book.status === "in progress");
    const upNextBooks = data.filter((book) => book.status === "up next");
    const finishedBooks = data.filter((book) => book.status === "finished").reverse();
    return (
      <div className="bookshelf">
        <div className="bookshelf-content">
          <h2 className="mobile-title">My Bookshelf</h2>
          <div className="bookshelf-left">
            <InProgressContainer bookList={inProgressBooks}></InProgressContainer>
            <UpNextContainer bookList={upNextBooks}></UpNextContainer>
          </div>
          <div className="bookshelf-right">
            <FinishedContainer bookList={finishedBooks}></FinishedContainer>
          </div>
        </div>
      </div>
    );
    // }
  } else {
    // navigate("/search");
  }
}
export default BookshelfPage;
