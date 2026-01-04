import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ContactSection from "../components/ContactSection";
import Navbar from "../components/navbar";
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
  FaCheckCircle
} from "react-icons/fa";

import Login from "./Login";
import Register from "./Register";

const Welcome = () => {
  const [scrollY] = useState(0);
  const [authMode, setAuthMode] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    document.body.style.overflow = authMode ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [authMode]);

  const handleExploreClick = () => {
    if (!user) {
      setAuthMode("login");
    } else {
      navigate("/properties");
    }
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
      {/* NAVBAR - Show when user is logged in */}
      {user && <Navbar />}

      {/* ================= HERO ================= */}
      <section className="welcome-hero" style={{ paddingTop: user ? '70px' : '0' }}>
        <div
          className="hero-overlay"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />

        {/* Show brand corner and auth buttons only when NOT logged in */}
        {!user && (
          <>
            <div className="brand-corner">
              <img
                src={`${process.env.PUBLIC_URL}/logo-3d.png`}
                alt="Propify Logo"
              />
              <span>Propify</span>
            </div>

            <div className="auth-fixed">
              {!authMode && (
                <>
                  <button
                    className="btn-auth-text"
                    onClick={() => setAuthMode("login")}
                  >
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
            </div>
          </>
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

          <div className="welcome-cta-group">
            <button
              className="btn-welcome-primary"
              onClick={handleExploreClick}
            >
              <FaSearch /> Explore Properties
              <FaArrowRight className="arrow-icon" />
            </button>
          </div>

          <div className="trust-indicators">
            <div className="trust-item">
              <FaCheckCircle />
              <span>100% Verified Listings</span>
            </div>
            <div className="trust-item">
              <FaCheckCircle />
              <span>Trusted by Smart Users</span>
            </div>
            <div className="trust-item">
              <FaCheckCircle />
              <span>24/7 Customer Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-us-section">
        <div className="welcome-container">
          <h2>About Us</h2>
          <h3>Your trusted partner in modern real estate solutions</h3>
          <p>
            <strong>Propify</strong> is a modern real estate platform built to simplify property buying, selling, and renting.
           Our goal is to empower customers and brokers with smart tools, 
           real-time insights, and seamless communication.
          </p>
        </div>
      </section>

      {/* PROPERTY TYPES */}
      <section className="property-types-section">
        <div className="welcome-container">
          <h2>Browse By Property Type</h2>
          <div className="property-types-grid">
            {propertyTypes.map((type, index) => (
              <div
                key={index}
                className="property-type-card"
                onClick={() => navigate("/properties")}
              >
                <div className="type-icon">{type.icon}</div>
                <h3>{type.name}</h3>
                <p>{type.count} listings</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="welcome-features">
        <div className="welcome-container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="welcome-feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />

      {/* AUTH MODAL */}
      {authMode && (
        <div className="auth-overlay">
          <button className="auth-close" onClick={() => setAuthMode(null)}>
            ×
          </button>
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