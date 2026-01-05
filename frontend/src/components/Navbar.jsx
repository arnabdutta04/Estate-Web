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
  const { user, loading, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar-fixed" style={{ display: 'block', visibility: 'visible' }}>
      <div className="navbar-container" style={{ display: 'flex', visibility: 'visible' }}>
        {/* Logo Section */}
        <div className="navbar-brand" onClick={() => navigate("/")} style={{ display: 'flex', visibility: 'visible' }}>
          <img
            src={`${process.env.PUBLIC_URL}/logo-3d.png`}
            alt="Propify Logo"
          />
          <span>Propify</span>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links" style={{ display: 'flex', visibility: 'visible' }}>
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
        <div className="navbar-user" style={{ display: 'flex', visibility: 'visible' }}>
          {!loading && !user ? (
            <>
              <button
                className="nav-link login-btn"
                onClick={() => navigate("/login")}
                style={{ display: 'block', visibility: 'visible' }}
              >
                <FaSignInAlt /> Login
              </button>

              <button
                className="nav-link register-btn"
                onClick={() => navigate("/register")}
                style={{ display: 'block', visibility: 'visible' }}
              >
                <FaUserPlus /> Register
              </button>
            </>
          ) : !loading && user ? (
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
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;