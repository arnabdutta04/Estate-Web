import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ContactSection from "../components/ContactSection";
import {
  FaHome,
  FaKey,
  FaHandshake,
  FaSearch,
  FaArrowRight,
  FaStar,
  FaBuilding,
  FaMapMarkedAlt,
  FaChartLine,
  FaCheckCircle,
  FaUser,
  FaSignOutAlt,
  FaBars
} from "react-icons/fa";

import Login from "./Login";
import Register from "./Register";

const Welcome = () => {
  const [scrollY] = useState(0);
  const [authMode, setAuthMode] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ NEW
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    document.body.style.overflow = authMode ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [authMode]);

  const handleExploreClick = () => {
    if (!user) setAuthMode("login");
    else navigate("/properties");
  };

  const features = [
    {
      icon: <FaHandshake />,
      title: "Verified Brokers",
      description:
        "Connect with certified real estate professionals who understand your needs."
    },
    {
      icon: <FaKey />,
      title: "Easy Transactions",
      description:
        "Seamless buying, selling, and renting process with complete transparency."
    },
    {
      icon: <FaChartLine />,
      title: "Market Insights",
      description:
        "Access real-time market data and property valuations to make informed decisions."
    }
  ];

  const propertyTypes = [
    { icon: <FaHome />, name: "Residential", count: "5,000+" },
    { icon: <FaBuilding />, name: "Commercial", count: "2,500+" },
    { icon: <FaMapMarkedAlt />, name: "Land & Plots", count: "1,500+" },
    { icon: <FaStar />, name: "Luxury Villas", count: "1,000+" }
  ];

  return (
    <div className="welcome-page">
      <section className="welcome-hero">
        <div className="hero-overlay" />

        {/* BRAND */}
        <div className="brand-corner">
          <img src={`${process.env.PUBLIC_URL}/logo-3d.png`} alt="Propify Logo" />
          <span>Propify</span>
        </div>

        {/* ================= NAV BAR ================= */}
        <div className="auth-fixed">
          {/* DESKTOP NAV (UNCHANGED) */}
          <div className="nav-desktop">
            {!user && !authMode && (
              <>
                <button className="btn-auth-text" onClick={() => setAuthMode("login")}>
                  Login
                </button>
                <button
                  className="btn-auth-outline"
                  onClick={() => setAuthMode("register")}
                >
                  Register
                </button>
              </>
            )}

            {user && (
              <>
                <button className="btn-auth-text" onClick={() => navigate("/")}>
                  Home
                </button>
                <button className="btn-auth-text" onClick={() => navigate("/properties")}>
                  Properties
                </button>
                <button className="btn-auth-text" onClick={() => navigate("/brokers")}>
                  Brokers
                </button>
                <button className="btn-auth-text">
                  <FaUser /> {user.name}
                </button>
                <button
                  className="btn-auth-outline"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                    navigate("/");
                  }}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <div className="nav-mobile-icon" onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars />
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="mobile-menu">
            {!user && (
              <>
                <button onClick={() => setAuthMode("login")}>Login</button>
                <button onClick={() => setAuthMode("register")}>Register</button>
              </>
            )}

            {user && (
              <>
                <button onClick={() => navigate("/")}>Home</button>
                <button onClick={() => navigate("/properties")}>Properties</button>
                <button onClick={() => navigate("/brokers")}>Brokers</button>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}

        {/* HERO CONTENT */}
        <div className="welcome-container">
          <h1 className="welcome-title">
            Find Your <span className="highlight">Dream Home</span>
            <br />
            Where Memories Begin
          </h1>

          <p className="welcome-subtitle">
            Discover thousands of properties, connect with verified brokers,
            and make your real estate journey seamless and stress-free.
          </p>

          <button className="btn-welcome-primary" onClick={handleExploreClick}>
            <FaSearch /> Explore Properties <FaArrowRight />
          </button>

          <div className="trust-indicators">
            <span><FaCheckCircle /> 100% Verified Listings</span>
            <span><FaCheckCircle /> Trusted by Smart Users</span>
            <span><FaCheckCircle /> 24/7 Customer Support</span>
          </div>
        </div>
      </section>

      <ContactSection />

      {/* AUTH MODAL */}
      {authMode && (
        <div className="auth-overlay">
          <button className="auth-close" onClick={() => setAuthMode(null)}>×</button>
          <div className="auth-center">
            {authMode === "login" ? (
              <Login switchToRegister={() => setAuthMode("register")} />
            ) : (
              <Register switchToLogin={() => setAuthMode("login")} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Welcome;
