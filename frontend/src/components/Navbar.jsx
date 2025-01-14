import "../styles/Navbar.css";
import { useAuth } from "../hooks";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/rg-logo.png";
import MobileNav from "./MobileNav";

function LoggedInNav() {
  const { logout } = useAuth();

  const [isMobile, setIsMobile] = useState(false);

  // Update layout based on window size
  const checkMobileView = () => {
    setIsMobile(window.innerWidth <= 768); // 768px is the common breakpoint for mobile
  };

  useEffect(() => {
    checkMobileView(); // Check on initial load
    window.addEventListener("resize", checkMobileView); // Listen to window resize

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, []);

  if (isMobile) {
    return <MobileNav></MobileNav>;
  } else {
    return (
      <div className="sidebar">
        <div className="reading-goals-logo">
          <img className="nav-logo" src={logo} alt="Logo" />
          <span className="reading">Reading</span>
          <span className="goals">Goals</span>
        </div>
        <div className="nav-list">
          <NavLink className="nav-link" to="/dashboard">
            Dashboard
          </NavLink>
          <NavLink className="nav-link" to="/bookshelf">
            Bookshelf
          </NavLink>
        </div>
        <button className="sign-out" onClick={logout}>
          Sign Out
        </button>
      </div>
    );
  }

  // return (
  //   <div className="sidebar">
  //     <div className="reading-goals-logo">
  //       <img className="nav-logo" src={logo} alt="Logo" />
  //       <span className="reading">Reading</span>
  //       <span className="goals">Goals</span>
  //     </div>

  //     <div className="nav-list">
  //       <NavLink className="nav-link" to="/dashboard">
  //         Dashboard
  //       </NavLink>
  //       <NavLink className="nav-link" to="/bookshelf">
  //         Bookshelf
  //       </NavLink>
  //     </div>
  //     <button className="sign-out" onClick={logout}>
  //       Sign Out
  //     </button>
  //   </div>
  // );
}

function LoggedOutNav() {
  return <></>;
}

function Navbar() {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    return <LoggedInNav></LoggedInNav>;
  }
  if (!isLoggedIn) {
    return <LoggedOutNav></LoggedOutNav>;
  }
}
export default Navbar;
