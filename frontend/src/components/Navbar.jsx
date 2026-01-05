import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar-fixed">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-brand" onClick={() => navigate("/")}>
          <img
            src={`${process.env.PUBLIC_URL}/logo-3d.png`}
            alt="Propify Logo"
          />
          <span>Propify</span>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <button
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <button
            className={`nav-link ${isActive("/properties") ? "active" : ""}`}
            onClick={() => navigate("/properties")}
          >
            Properties
          </button>

          <button
            className={`nav-link ${isActive("/brokers") ? "active" : ""}`}
            onClick={() => navigate("/brokers")}
          >
            Brokers
          </button>
        </div>

        {/* User / Auth Section */}
        <div className="navbar-user">
          {!user ? (
            <>
              <button
                className="nav-link login-btn"
                onClick={() => navigate("/login")}
              >
                <FaSignInAlt /> Login
              </button>

              <button
                className="nav-link register-btn"
                onClick={() => navigate("/register")}
              >
                <FaUserPlus /> Register
              </button>
            </>
          ) : (
            <>
              <button
                className="nav-link user-profile"
                onClick={() => navigate("/profile")}
              >
                <FaUser /> {user.name || "Profile"}
              </button>

              <button className="btn-logout" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
