import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ContactSection from "../components/ContactSection";
import Navbar from "../components/Navbar";

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
  FaTrendingUp,
  FaPercentage,
  FaCalendarAlt,
  FaChartBar
} from "react-icons/fa";

const Welcome = () => {
  const [scrollY] = useState(0);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Updated: Allow all users to view properties (no auth check)
  const handleExploreClick = () => {
    navigate("/properties"); // Navigate directly without auth requirement
  };

  // Navigate to Explore page
  const handleExplorePageClick = () => {
    navigate("/explore");
  };

  // Updated: Handle property type click for all users
  const handlePropertyTypeClick = (propertyType) => {
    // Navigate to properties page, optionally with filter parameter
    navigate("/properties", { state: { filter: propertyType } });
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
    { icon: <FaHome />, name: "Residential", count: "5,000+", filter: "residential" },
    { icon: <FaBuilding />, name: "Commercial", count: "2,500+", filter: "commercial" },
    { icon: <FaMapMarkedAlt />, name: "Land & Plots", count: "1,500+", filter: "land" },
    { icon: <FaStar />, name: "Luxury Villas", count: "1,000+", filter: "luxury" }
  ];

  const exploreFeatures = [
    {
      icon: <FaChartBar />,
      title: "Market Analytics",
      description: "5-year property appreciation trends across all major cities"
    },
    {
      icon: <FaTrendingUp />,
      title: "Growth Insights",
      description: "City-wise YoY growth data with demand indicators"
    },
    {
      icon: <FaPercentage />,
      title: "Investment Guide",
      description: "Best time to buy, rental yields, and price appreciation"
    },
    {
      icon: <FaCalendarAlt />,
      title: "Real-time Data",
      description: "Live market updates and property valuation insights"
    }
  ];

  return (
    <div className="welcome-page">
      {/* NAVBAR - ALWAYS VISIBLE */}
      <Navbar />

      {/* ================= HERO ================= */}
      <section
        className="welcome-hero"
        style={{ paddingTop: "70px" }}
      >
        <div
          className="hero-overlay"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />

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
              <FaSearch /> Start
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

      {/* ================= ABOUT ================= */}
      <section className="about-us-section">
        <div className="welcome-container">
          <h2>About Us</h2>
          <h3>Your trusted partner in modern real estate solutions</h3>
          <p>
            <strong>Propify</strong> is a modern real estate platform built to
            simplify property buying, selling, and renting. Our goal is to
            empower customers and brokers with smart tools, real-time insights,
            and seamless communication.
          </p>
        </div>
      </section>

      {/* ================= PROPERTY TYPES ================= */}
      <section className="property-types-section">
        <div className="welcome-container">
          <h2>Browse By Property Type</h2>
          <div className="property-types-grid">
            {propertyTypes.map((type, index) => (
              <div
                key={index}
                className="property-type-card"
                onClick={() => handlePropertyTypeClick(type.filter)}
              >
                <div className="type-icon">{type.icon}</div>
                <h3>{type.name}</h3>
                <p>{type.count} listings</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MARKET INSIGHTS & EXPLORE SECTION ================= */}
      <section className="explore-preview-section">
        <div className="welcome-container">
          <div className="explore-preview-header">
            <h2>Make Smarter Investment Decisions</h2>
            <p>Access comprehensive market analytics, growth trends, and investment insights all in one place</p>
          </div>

          <div className="explore-features-grid">
            {exploreFeatures.map((feature, index) => (
              <div key={index} className="explore-preview-card">
                <div className="explore-preview-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="explore-stats-banner">
            <div className="stat-item">
              <div className="stat-number">18.3%</div>
              <div className="stat-label">Avg. YoY Growth</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">6 Cities</div>
              <div className="stat-label">Market Coverage</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5 Years</div>
              <div className="stat-label">Historical Data</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Listings</div>
            </div>
          </div>

          <div className="explore-cta-wrapper">
            <button
              className="btn-explore-page"
              onClick={handleExplorePageClick}
            >
              <FaChartLine /> View Market Analytics
              <FaArrowRight className="arrow-icon" />
            </button>
            <p className="explore-cta-note">
              Get detailed insights on property appreciation, city-wise growth, and broker benefits
            </p>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
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
    </div>
  );
};

export default Welcome;