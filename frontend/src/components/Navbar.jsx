import React, { useContext, useState, useEffect, useTransition } from "react";
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
          <button
            className={`nav-link-glass ${isActive("/") ? "active" : ""}`}
            onClick={() => handleNavigation("/")}
          >
            Home
          </button>
          <button
            className={`nav-link-glass ${isActive("/explore") ? "active" : ""}`}
            onClick={() => handleNavigation("/explore")}
          >
            Explore
          </button>

          <button
            className={`nav-link-glass ${isActive("/properties") ? "active" : ""}`}
            onClick={() => handleNavigation("/properties")}
          >
            Properties
          </button>

          <button
            className={`nav-link-glass ${isActive("/brokers") ? "active" : ""}`}
            onClick={() => handleNavigation("/brokers")}
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
                onClick={() => handleNavigation("/Login")}
              >
                Login <FaArrowRight />
              </button>
              <button
                className="cta-btn-glass register-btn-glass"
                onClick={() => handleNavigation("/Register")}
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