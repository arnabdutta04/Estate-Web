import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container">
        {/* LOGO */}
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <FaHome /> RealEstate Pro
        </Link>

        {/* MOBILE MENU ICON */}
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* NAV LINKS */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/home" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>

          <li>
            <Link to="/properties" onClick={() => setMenuOpen(false)}>
              Properties
            </Link>
          </li>

          <li>
            <Link to="/brokers" onClick={() => setMenuOpen(false)}>
              Brokers
            </Link>
          </li>

          {/* AUTHENTICATED USER */}
          {user ? (
            <>
              {/* CUSTOMER */}
              {user.role === "customer" && (
                <li>
                  <Link to="/customer-dashboard" onClick={() => setMenuOpen(false)}>
                    <FaUser /> My Account
                  </Link>
                </li>
              )}

              {/* BROKER */}
              {user.role === "broker" && (
                <li>
                  <Link to="/broker-dashboard" onClick={() => setMenuOpen(false)}>
                    <FaUser /> Broker Panel
                  </Link>
                </li>
              )}

              <li>
                <button onClick={handleLogout} className="btn-logout">
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              {/* GUEST */}
              <li>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <FaSignInAlt /> Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="btn-register"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
