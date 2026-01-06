import React, { useContext, useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
        console.log('🔄 Scroll state changed:', isScrolled); // Debug log
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  console.log('🎨 Navbar scrolled state:', scrolled); // Debug log

  return (
    <nav className={`navbar-fixed ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-brand" onClick={() => navigate("/")}>
          <img
            src={`${process.env.PUBLIC_URL}/logo-3d.png`}
            alt="Propify Logo"
          />
          <span>Propify</span>
        </div>
        <div class="navbar-spacer"></div>
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
          {!loading && !user ? (
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