import React, { useContext, useState, useEffect, useTransition } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBriefcase } from 'react-icons/fa';
import "./navbar.css"; 
import {
  FaUser,
  FaSignOutAlt,
  FaArrowRight,
  FaUserPlus,
  FaLock
} from "react-icons/fa";
import ProfilePanel from "./ProfilePanel"; // ✅ CHANGE 1: import panel

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [profileOpen, setProfileOpen] = useState(false); // ✅ CHANGE 2: panel state

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

  const handleProtectedNavigation = (path) => {
    if (user) {
      startTransition(() => {
        navigate(path);
      });
    } else {
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
    <>
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
              className={`nav-link-glass ${isActive("/properties") ? "active" : ""} ${!user ? "protected-link" : ""}`}
              onClick={() => handleProtectedNavigation("/properties")}
            >
              Properties
              {!user && <FaLock className="lock-icon" />}
            </button>

            <button
              className={`nav-link-glass ${isActive("/brokers") || isActive("/broker/dashboard") ? "active" : ""} ${!user ? "protected-link" : ""}`}
              onClick={() => {
                if (user && user.role === 'broker') {
                  handleNavigation("/broker/dashboard");
                } else {
                  handleProtectedNavigation("/brokers");
                }
              }}
            >
              {user && user.role === 'broker' ? (
                <>
                  <FaBriefcase /> My Dashboard
                </>
              ) : (
                <>
                  Brokers
                  {!user && <FaLock className="lock-icon" />}
                </>
              )}
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
                {/* ✅ CHANGE 3: onClick opens panel instead of navigating to /profile */}
                <button
                  className="user-profile-glass"
                  onClick={() => setProfileOpen(true)}
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

      {/* ✅ CHANGE 4: ProfilePanel renders here — over whatever page is open */}
      <ProfilePanel isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
};

export default Navbar;