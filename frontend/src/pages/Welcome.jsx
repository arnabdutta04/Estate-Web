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
  FaPercentage,
  FaCalendarAlt,
  FaChartBar,
} from "react-icons/fa";
import { FaArrowTrendUp as FaTrendingUp } from "react-icons/fa6";

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
      <section className="explore-showcase-section">
  <div className="showcase-container">
    <div className="showcase-header">
      <h2>Explore Real Estate Market Trends</h2>
      <p>Data-driven insights for smarter property investments</p>
    </div>

    <div className="showcase-card">
      {/* Header Banner */}
      <div className="showcase-banner">
        <div className="banner-left">
          <div className="banner-icon">
            <FaChartLine />
          </div>
          <div className="banner-title">
            <h3>Real Estate Trends</h3>
            <div className="banner-subtitle">Market Infographic</div>
          </div>
        </div>
        <div className="banner-right">
          <div className="banner-badge">2020-2024</div>
        </div>
      </div>

      {/* Decorative Buildings Top */}
      <div className="showcase-buildings">
        <FaBuilding className="building-icon" />
        <FaHome className="building-icon" />
        <FaBuilding className="building-icon" />
      </div>

      {/* Main Content */}
      <div className="showcase-content">
        {/* Left Section - Features */}
        <div className="showcase-left">
          <h4><FaChartBar /> Market Analytics</h4>
          <ul className="feature-list">
            <li className="feature-item">
              <div className="feature-item-title">Projected Rates</div>
              <div className="feature-item-desc">18.3% Average YoY Growth</div>
            </li>
            <li className="feature-item">
              <div className="feature-item-title">Market Coverage</div>
              <div className="feature-item-desc">6 Major Cities Tracked</div>
            </li>
            <li className="feature-item">
              <div className="feature-item-title">Property Types</div>
              <div className="feature-item-desc">Residential, Commercial, Luxury</div>
            </li>
            <li className="feature-item">
              <div className="feature-item-title">Historical Data</div>
              <div className="feature-item-desc">5 Years of Trends</div>
            </li>
          </ul>
        </div>

        {/* Center Section - Chart */}
        <div className="showcase-center">
          <h4 className="chart-title">Property Value Appreciation (2020-2024)</h4>
          <div className="chart-wrapper">
            <div className="chart-bars">
              {/* 2020 */}
              <div className="chart-bar-group">
                <div className="chart-bars-wrapper">
                  <div 
                    className="chart-bar residential" 
                    style={{ height: '65%' }}
                    title="Residential: 65%"
                  />
                  <div 
                    className="chart-bar commercial" 
                    style={{ height: '45%' }}
                    title="Commercial: 45%"
                  />
                  <div 
                    className="chart-bar luxury" 
                    style={{ height: '80%' }}
                    title="Luxury: 80%"
                  />
                </div>
                <div className="chart-year">2020</div>
                <div className="chart-appreciation">+5.2%</div>
              </div>

              {/* 2021 */}
              <div className="chart-bar-group">
                <div className="chart-bars-wrapper">
                  <div 
                    className="chart-bar residential" 
                    style={{ height: '72%' }}
                    title="Residential: 72%"
                  />
                  <div 
                    className="chart-bar commercial" 
                    style={{ height: '52%' }}
                    title="Commercial: 52%"
                  />
                  <div 
                    className="chart-bar luxury" 
                    style={{ height: '88%' }}
                    title="Luxury: 88%"
                  />
                </div>
                <div className="chart-year">2021</div>
                <div className="chart-appreciation">+8.5%</div>
              </div>

              {/* 2022 */}
              <div className="chart-bar-group">
                <div className="chart-bars-wrapper">
                  <div 
                    className="chart-bar residential" 
                    style={{ height: '78%' }}
                    title="Residential: 78%"
                  />
                  <div 
                    className="chart-bar commercial" 
                    style={{ height: '58%' }}
                    title="Commercial: 58%"
                  />
                  <div 
                    className="chart-bar luxury" 
                    style={{ height: '95%' }}
                    title="Luxury: 95%"
                  />
                </div>
                <div className="chart-year">2022</div>
                <div className="chart-appreciation">+11.2%</div>
              </div>

              {/* 2023 */}
              <div className="chart-bar-group">
                <div className="chart-bars-wrapper">
                  <div 
                    className="chart-bar residential" 
                    style={{ height: '85%' }}
                    title="Residential: 85%"
                  />
                  <div 
                    className="chart-bar commercial" 
                    style={{ height: '65%' }}
                    title="Commercial: 65%"
                  />
                  <div 
                    className="chart-bar luxury" 
                    style={{ height: '102%' }}
                    title="Luxury: 102%"
                  />
                </div>
                <div className="chart-year">2023</div>
                <div className="chart-appreciation">+14.8%</div>
              </div>

              {/* 2024 */}
              <div className="chart-bar-group">
                <div className="chart-bars-wrapper">
                  <div 
                    className="chart-bar residential" 
                    style={{ height: '92%' }}
                    title="Residential: 92%"
                  />
                  <div 
                    className="chart-bar commercial" 
                    style={{ height: '72%' }}
                    title="Commercial: 72%"
                  />
                  <div 
                    className="chart-bar luxury" 
                    style={{ height: '110%' }}
                    title="Luxury: 110%"
                  />
                </div>
                <div className="chart-year">2024</div>
                <div className="chart-appreciation">+18.3%</div>
              </div>
            </div>

            {/* Chart Legend */}
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color residential"></span>
                <span>Residential</span>
              </div>
              <div className="legend-item">
                <span className="legend-color commercial"></span>
                <span>Commercial</span>
              </div>
              <div className="legend-item">
                <span className="legend-color luxury"></span>
                <span>Luxury</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Stats */}
        <div className="showcase-right">
          <div className="stat-card-showcase">
            <div className="stat-icon-circle">
              <FaTrendingUp />
            </div>
            <div className="stat-value-showcase">4.5% - 6.2%</div>
            <div className="stat-label-showcase">Rental Yield</div>
          </div>

          <div className="stat-card-showcase">
            <div className="stat-icon-circle">
              <FaPercentage />
            </div>
            <div className="stat-value-showcase">+18.3%</div>
            <div className="stat-label-showcase">Price Growth</div>
          </div>

          <div className="stat-card-showcase">
            <div className="stat-icon-circle">
              <FaCalendarAlt />
            </div>
            <div className="stat-value-showcase">Q1 2025</div>
            <div className="stat-label-showcase">Best Time</div>
          </div>

          <div className="stat-card-showcase">
            <div className="stat-icon-circle">
              <FaMapMarkedAlt />
            </div>
            <div className="stat-value-showcase">6 Cities</div>
            <div className="stat-label-showcase">Coverage</div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="showcase-footer">
        <div className="footer-text">
          <h4>Ready to Explore Detailed Market Analytics?</h4>
          <p>Get comprehensive insights on property appreciation, city-wise growth, and broker benefits</p>
        </div>
        <button 
          className="btn-explore-now"
          onClick={handleExplorePageClick}
        >
          View Market Analytics <FaArrowRight />
        </button>
      </div>
    </div>
  </div>
</section>
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