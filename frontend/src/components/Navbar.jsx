import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./navbar.css"; 
import {
  FaUser,
  FaSignOutAlt,
  FaArrowRight,
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
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar-glass-modern ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-glass-wrapper">
        {/* Logo Section */}
        <div className="navbar-logo-glass" onClick={() => navigate("/")}>
          <span className="logo-text-glass">PROPIFY</span>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links-glass">
          <button
            className={`nav-link-glass ${isActive("/") ? "active" : ""}`}
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <button
            className={`nav-link-glass ${isActive("/properties") ? "active" : ""}`}
            onClick={() => navigate("/properties")}
          >
            Properties
          </button>

          <button
            className={`nav-link-glass ${isActive("/brokers") ? "active" : ""}`}
            onClick={() => navigate("/brokers")}
          >
            Broker
          </button>
        </div>

        {/* User / Auth Section */}
        <div className="navbar-actions-glass">
          {!loading && !user ? (
            <>
              <button
                className="cta-btn-glass"
                onClick={() => navigate("/Login")}
              >
                Login <FaArrowRight />
              </button>
              <button
                className="cta-btn-glass register-btn-glass"
                onClick={() => navigate("/Register")}
              >
                Register <FaUserPlus />
              </button>
            </>
          ) : !loading && user ? (
            <>
              <button
                className="user-profile-glass"
                onClick={() => navigate("/profile")}
              >
                <FaUser /> {user.name || "Profile"}
              </button>
              <button className="logout-btn-glass" onClick={handleLogout}>
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