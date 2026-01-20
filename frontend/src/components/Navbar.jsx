import React, { useContext, useState, useEffect, useTransition } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./navbar.css"; 
import {
  FaUser,
  FaSignOutAlt,
  FaArrowRight,
  FaUserPlus,
  FaLock
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  const handleNavigation = (path) => {
    startTransition(() => {
      navigate(path);
    });
  };

  // Protected navigation - requires login
  const handleProtectedNavigation = (path) => {
    if (user) {
      startTransition(() => {
        navigate(path);
      });
    } else {
      // Redirect to login with return path
      startTransition(() => {
        navigate("/login", { state: { from: path } });
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar-glass-modern ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-glass-wrapper">
        {/* Logo Section */}
        <div className="navbar-logo-glass" onClick={() => handleNavigation("/")}>
          <span className="logo-text-glass">PROPIFY</span>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links-glass">
          {/* PUBLIC - No login required */}
          <button
            className={`nav-link-glass ${isActive("/") ? "active" : ""}`}
            onClick={() => handleNavigation("/")}
          >
            Home
          </button>

          {/* PUBLIC - No login required */}
          <button
            className={`nav-link-glass ${isActive("/explore") ? "active" : ""}`}
            onClick={() => handleNavigation("/explore")}
          >
            Explore
          </button>

          {/* PROTECTED - Requires login */}
          <button
            className={`nav-link-glass ${isActive("/properties") ? "active" : ""} ${!user ? "protected-link" : ""}`}
            onClick={() => handleProtectedNavigation("/properties")}
          >
            Properties
            {!user && <FaLock className="lock-icon" />}
          </button>

          {/* PROTECTED - Requires login */}
          <button
            className={`nav-link-glass ${isActive("/brokers") ? "active" : ""} ${!user ? "protected-link" : ""}`}
            onClick={() => handleProtectedNavigation("/brokers")}
          >
            Broker
            {!user && <FaLock className="lock-icon" />}
          </button>
        </div>

        {/* User / Auth Section */}
        <div className="navbar-actions-glass">
          {!loading && !user ? (
            <>
              <button
                className="cta-btn-glass"
                onClick={() => handleNavigation("/login")}
              >
                Login <FaArrowRight />
              </button>
              <button
                className="cta-btn-glass register-btn-glass"
                onClick={() => handleNavigation("/register")}
              >
                Register <FaUserPlus />
              </button>
            </>
          ) : !loading && user ? (
            <>
              <button
                className="user-profile-glass"
                onClick={() => handleNavigation("/profile")}
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