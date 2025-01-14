import "../styles/MobileNav.css";

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks";
import logo from "../assets/images/rg-logo.png";

function MobileNav() {
  const [isMenuOpen, setMenuOpen] = useState(false); // state for toggle menu visibility
  const { logout } = useAuth();

  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  return (
    <div className={`mobile-navbar ${isMenuOpen ? "open" : ""}`}>
      {/* <div className="reading-goals-logo">
        <img className="nav-logo" src={logo} alt="Logo" />
        <span className="reading">Reading</span>
        <span className="goals">Goals</span>
      </div> */}

      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleMenu}>
        {isMenuOpen && <div>X</div>}
        {!isMenuOpen && <i class="fa-solid fa-bars"></i>}
        {/* Hamburger Icon */}
      </div>

      {/* Mobile menu */}
      <div className={`mobile-nav-list ${isMenuOpen ? "open" : ""}`}>
        <div className="nav-links">
          <NavLink onClick={toggleMenu} className="nav-link" to="/dashboard">
            Dashboard
          </NavLink>
          <NavLink onClick={toggleMenu} className="nav-link" to="/bookshelf">
            Bookshelf
          </NavLink>
        </div>
        <button className="sign-out" onClick={logout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default MobileNav;
