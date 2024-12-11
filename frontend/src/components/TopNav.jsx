import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/rg-logo.png";
import "./TopNav.css";

function LoggedInNav() {
  const { logout } = useAuth();
  return (
    <div className="sidebar">
      {/* <h3>Reading Goals</h3> */}

      <div class="reading-goals-logo">
        <img className="nav-logo" src={logo} alt="Logo" />
        <span class="reading">Reading</span>
        <span class="goals">Goals</span>
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
  return <>{/* <img src="..assets/images/logo.jpg"></img> */}</>;
}

function TopNav() {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    return <LoggedInNav></LoggedInNav>;
  }
  if (!isLoggedIn) {
    return <LoggedOutNav></LoggedOutNav>;
  }
}
export default TopNav;
