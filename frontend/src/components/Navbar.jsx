import "../styles/Navbar.css";
import { useAuth } from "../hooks";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/rg-logo.png";

function LoggedInNav() {
  const { logout } = useAuth();
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
