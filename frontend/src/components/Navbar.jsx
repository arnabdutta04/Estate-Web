import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaMoon,
  FaSun
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useContext(AuthContext);
  const { theme, changeTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Toggle between light and dark theme
  const toggleDarkMode = () => {
    if (theme === 'dark') {
      changeTheme('light');
    } else {
      changeTheme('dark');
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  // Check if currently in dark mode
  const isDarkMode = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

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
          {/* Dark Mode Toggle */}
          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>

          {!loading && !user ? (
            <>
              <button
                className="login-btn"
                onClick={() => navigate("/login")}
              >
                <FaSignInAlt /> Login
              </button>

              <button
                className="register-btn"
                onClick={() => navigate("/register")}
              >
                <FaUserPlus /> Register
              </button>
            </>
          ) : !loading && user ? (
            <>
              <button
                className="user-profile"
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