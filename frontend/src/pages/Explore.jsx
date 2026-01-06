import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaHome,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaHeart,
  FaFilter,
  FaTimes,
  FaMapMarkedAlt,
  FaChartLine,
  FaArrowTrendUp as FaTrendingUp,
  FaUsers,
  FaHandshake,
  FaShieldAlt,
  FaAward,
  FaMoneyBillWave,
  FaPercentage,
  FaCalendarAlt,
  FaArrowRight
} from "react-icons/fa";
import "./Explore.css";

const Explore = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Market Trends Data
  const marketTrends = [
    {
      year: "2020",
      residential: 65,
      commercial: 45,
      luxury: 80,
      appreciation: 5.2
    },
    {
      year: "2021",
      residential: 72,
      commercial: 52,
      luxury: 88,
      appreciation: 8.5
    },
    {
      year: "2022",
      residential: 78,
      commercial: 58,
      luxury: 95,
      appreciation: 11.2
    },
    {
      year: "2023",
      residential: 85,
      commercial: 65,
      luxury: 102,
      appreciation: 14.8
    },
    {
      year: "2024",
      residential: 92,
      commercial: 72,
      luxury: 110,
      appreciation: 18.3
    }
  ];

  // City-wise Growth Data
  const cityGrowth = [
    { city: "Mumbai", growth: 18.5, avgPrice: "₹95L", trend: "up", demand: "High" },
    { city: "Bangalore", growth: 22.3, avgPrice: "₹78L", trend: "up", demand: "Very High" },
    { city: "Delhi NCR", growth: 15.8, avgPrice: "₹85L", trend: "up", demand: "High" },
    { city: "Pune", growth: 19.2, avgPrice: "₹68L", trend: "up", demand: "High" },
    { city: "Hyderabad", growth: 21.7, avgPrice: "₹62L", trend: "up", demand: "Very High" },
    { city: "Goa", growth: 12.4, avgPrice: "₹1.2Cr", trend: "stable", demand: "Medium" }
  ];

  // Broker Benefits
  const brokerBenefits = [
    {
      icon: <FaUsers />,
      title: "10,000+ Active Users",
      description: "Connect with thousands of verified buyers and sellers actively looking for properties."
    },
    {
      icon: <FaHandshake />,
      title: "Higher Closing Rates",
      description: "70% faster property deals with our advanced matching algorithm and qualified leads."
    },
    {
      icon: <FaShieldAlt />,
      title: "Verified Platform",
      description: "100% secure transactions with verified documentation and legal compliance support."
    },
    {
      icon: <FaAward />,
      title: "Premium Listing",
      description: "Showcase your properties to targeted audiences with featured placements and analytics."
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Better Commission",
      description: "Earn competitive commissions with transparent pricing and instant payment processing."
    },
    {
      icon: <FaPercentage />,
      title: "Zero Platform Fee",
      description: "Join now and list unlimited properties with no hidden charges for the first 6 months."
    }
  ];

  // Investment Insights
  const investmentInsights = [
    {
      title: "Best Time to Buy",
      value: "Q1 2025",
      description: "Interest rates expected to stabilize, making it ideal for home buyers.",
      icon: <FaCalendarAlt />
    },
    {
      title: "Rental Yield",
      value: "4.5% - 6.2%",
      description: "Average rental returns across major metros show steady growth.",
      icon: <FaPercentage />
    },
    {
      title: "Price Appreciation",
      value: "+18.3%",
      description: "Year-over-year property value increase in prime locations.",
      icon: <FaTrendingUp />
    },
    {
      title: "Market Sentiment",
      value: "Bullish",
      description: "Strong demand and limited inventory driving positive market outlook.",
      icon: <FaChartLine />
    }
  ];

  const [properties] = useState([
    {
      id: 1,
      title: "Modern Downtown Apartment",
      location: "Mumbai, Maharashtra",
      lat: 19.0760,
      lng: 72.8777,
      type: "Residential",
      price: "₹85,00,000",
      beds: 3,
      baths: 2,
      area: "1,450 sq ft",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      featured: true
    },
    {
      id: 2,
      title: "Luxury Villa with Pool",
      location: "Bangalore, Karnataka",
      lat: 12.9716,
      lng: 77.5946,
      type: "Luxury",
      price: "₹2,50,00,000",
      beds: 5,
      baths: 4,
      area: "3,500 sq ft",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      featured: true
    },
    {
      id: 3,
      title: "Commercial Office Space",
      location: "Delhi, NCR",
      lat: 28.7041,
      lng: 77.1025,
      type: "Commercial",
      price: "₹1,20,00,000",
      beds: 0,
      baths: 3,
      area: "2,800 sq ft",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      featured: false
    },
    {
      id: 4,
      title: "Residential Plot",
      location: "Pune, Maharashtra",
      lat: 18.5204,
      lng: 73.8567,
      type: "Land",
      price: "₹45,00,000",
      beds: 0,
      baths: 0,
      area: "2,400 sq ft",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      featured: false
    },
    {
      id: 5,
      title: "Cozy Studio Apartment",
      location: "Hyderabad, Telangana",
      lat: 17.3850,
      lng: 78.4867,
      type: "Residential",
      price: "₹35,00,000",
      beds: 1,
      baths: 1,
      area: "650 sq ft",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      featured: false
    },
    {
      id: 6,
      title: "Beachfront Villa",
      location: "Goa",
      lat: 15.2993,
      lng: 74.1240,
      type: "Luxury",
      price: "₹3,75,00,000",
      beds: 4,
      baths: 3,
      area: "3,200 sq ft",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      featured: true
    }
  ]);

  const [filteredProperties, setFilteredProperties] = useState(properties);

  useEffect(() => {
    let filtered = properties;

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter((p) =>
        p.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((p) => p.type === selectedType);
    }

    setFilteredProperties(filtered);
  }, [searchQuery, selectedLocation, selectedType, priceRange, properties]);

  const locations = ["Mumbai", "Bangalore", "Delhi", "Pune", "Hyderabad", "Goa"];

  const handlePropertyClick = (id) => {
    navigate(`/property-preview/${id}`);
  };

  return (
    <div className="explore-page">
      <Navbar />

      {/* Hero Search Section */}
      <section className="explore-hero">
        <div className="explore-hero-content">
          <h1>Discover Your Perfect Property</h1>
          <p>Explore thousands of verified listings with real-time market insights</p>

          <div className="explore-search-bar">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by location, property name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="advanced-filters">
              <div className="filter-group">
                <label>Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="all">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Property Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land">Land & Plots</option>
                  <option value="Luxury">Luxury Villas</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="all">All Prices</option>
                  <option value="0-50">Under ₹50L</option>
                  <option value="50-100">₹50L - ₹1Cr</option>
                  <option value="100-200">₹1Cr - ₹2Cr</option>
                  <option value="200+">Above ₹2Cr</option>
                </select>
              </div>

              <button
                className="clear-filters-btn"
                onClick={() => {
                  setSelectedLocation("all");
                  setSelectedType("all");
                  setPriceRange("all");
                  setSearchQuery("");
                }}
              >
                <FaTimes /> Clear All
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Market Insights Section */}
      <section className="market-insights-section">
        <div className="explore-container">
          <div className="section-header">
            <h2>Market Insights & Analytics</h2>
            <p>Make informed decisions with real-time market data and trends</p>
          </div>

          {/* Investment Insights Cards */}
          <div className="investment-insights-grid">
            {investmentInsights.map((insight, index) => (
              <div key={index} className="insight-card">
                <div className="insight-icon">{insight.icon}</div>
                <h3>{insight.title}</h3>
                <div className="insight-value">{insight.value}</div>
                <p>{insight.description}</p>
              </div>
            ))}
          </div>

          {/* City-wise Growth Table */}
          <div className="city-growth-section">
            <h3>City-wise Property Growth (2024)</h3>
            <div className="city-growth-grid">
              {cityGrowth.map((city, index) => (
                <div key={index} className="city-growth-card">
                  <div className="city-header">
                    <h4>{city.city}</h4>
                    <span className={`demand-badge ${city.demand.toLowerCase().replace(' ', '-')}`}>
                      {city.demand} Demand
                    </span>
                  </div>
                  <div className="growth-stats">
                    <div className="stat">
                      <span className="stat-label">YoY Growth</span>
                      <span className="stat-value growth-positive">
                        <FaTrendingUp /> +{city.growth}%
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Avg. Price</span>
                      <span className="stat-value">{city.avgPrice}</span>
                    </div>
                  </div>
                  <button className="btn-view-city" onClick={() => setSelectedLocation(city.city)}>
                    View Properties <FaArrowRight />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Market Trend Chart Placeholder */}
          <div className="market-trend-chart">
            <h3>5-Year Property Value Appreciation Trend</h3>
            <div className="chart-container">
              <div className="chart-bars">
                {marketTrends.map((trend, index) => (
                  <div key={index} className="chart-bar-group">
                    <div className="chart-bars-wrapper">
                      <div 
                        className="chart-bar residential"
                        style={{ height: `${trend.residential}%` }}
                        title={`Residential: ${trend.residential}%`}
                      />
                      <div 
                        className="chart-bar commercial"
                        style={{ height: `${trend.commercial}%` }}
                        title={`Commercial: ${trend.commercial}%`}
                      />
                      <div 
                        className="chart-bar luxury"
                        style={{ height: `${trend.luxury}%` }}
                        title={`Luxury: ${trend.luxury}%`}
                      />
                    </div>
                    <div className="chart-year">{trend.year}</div>
                    <div className="chart-appreciation">+{trend.appreciation}%</div>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <span className="legend-item"><span className="legend-color residential"></span> Residential</span>
                <span className="legend-item"><span className="legend-color commercial"></span> Commercial</span>
                <span className="legend-item"><span className="legend-color luxury"></span> Luxury</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Broker Benefits Section */}
      <section className="broker-benefits-section">
        <div className="explore-container">
          <div className="section-header">
            <h2>Why Brokers Choose Propify</h2>
            <p>Join 5,000+ verified brokers and grow your real estate business</p>
          </div>

          <div className="broker-benefits-grid">
            {brokerBenefits.map((benefit, index) => (
              <div key={index} className="broker-benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="broker-cta">
            <button className="btn-join-broker" onClick={() => navigate("/register")}>
              Join as Broker <FaArrowRight />
            </button>
            <p className="broker-cta-note">Special offer: Zero listing fees for first 6 months!</p>
          </div>
        </div>
      </section>

      {/* View Toggle & Results Count */}
      <section className="explore-controls">
        <div className="explore-container">
          <div className="controls-wrapper">
            <div className="results-count">
              <strong>{filteredProperties.length}</strong> properties found
            </div>

            <div className="view-toggle">
              <button
                className={viewMode === "grid" ? "active" : ""}
                onClick={() => setViewMode("grid")}
              >
                <FaHome /> Grid View
              </button>
              <button
                className={viewMode === "map" ? "active" : ""}
                onClick={() => setViewMode("map")}
              >
                <FaMapMarkedAlt /> Map View
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Display */}
      <section className="explore-content">
        <div className="explore-container">
          {viewMode === "grid" ? (
            <div className="properties-grid">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className="property-card"
                  onClick={() => handlePropertyClick(property.id)}
                >
                  {property.featured && (
                    <div className="featured-badge">Featured</div>
                  )}

                  <div className="property-image">
                    <img src={property.image} alt={property.title} />
                    <button className="favorite-btn">
                      <FaHeart />
                    </button>
                  </div>

                  <div className="property-info">
                    <h3>{property.title}</h3>
                    <p className="property-location">
                      <FaMapMarkerAlt /> {property.location}
                    </p>

                    <div className="property-details">
                      {property.beds > 0 && (
                        <span>
                          <FaBed /> {property.beds} Beds
                        </span>
                      )}
                      {property.baths > 0 && (
                        <span>
                          <FaBath /> {property.baths} Baths
                        </span>
                      )}
                      <span>
                        <FaRulerCombined /> {property.area}
                      </span>
                    </div>

                    <div className="property-footer">
                      <div className="property-price">{property.price}</div>
                      <div className="property-type">{property.type}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="map-view">
              <div className="map-container">
                <div className="map-placeholder">
                  <FaMapMarkedAlt size={60} />
                  <h3>Interactive Map</h3>
                  <p>Integrate Google Maps or Mapbox here</p>
                  <p className="map-instruction">
                    Show property markers at coordinates: lat/lng
                  </p>
                </div>
              </div>

              <div className="map-sidebar">
                {filteredProperties.map((property) => (
                  <div
                    key={property.id}
                    className="map-property-card"
                    onClick={() => handlePropertyClick(property.id)}
                  >
                    <img src={property.image} alt={property.title} />
                    <div className="map-property-info">
                      <h4>{property.title}</h4>
                      <p className="price">{property.price}</p>
                      <p className="location">
                        <FaMapMarkerAlt /> {property.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="explore-cta">
        <div className="explore-container">
          <h2>Ready to Find Your Dream Property?</h2>
          <p>Sign up to get personalized recommendations and save your favorites</p>
          <button className="btn-primary" onClick={() => navigate("/register")}>
            Create Free Account
          </button>
        </div>
      </section>
    </div>
  );
};

export default Explore;