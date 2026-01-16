import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Home, Building2, Crown, MapPin, Globe, RefreshCw, ChevronDown } from 'lucide-react';
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
import { FaArrowTrendUp as FaTrendingUp } from "react-icons/fa6";

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

      {/* Metro Living Hero Section */}
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-title">
              METRO<br />LIVING
            </h1>
            <button className="cta-button">
              Get In Touch
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 16L16 4M16 4H7M16 4V13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <p className="hero-description">
              Our properties are designed for those who appreciate the vibrancy of metropolitan living
            </p>
            <div className="property-icons">
              <div className="icon-item"></div>
              <div className="icon-item"></div>
              <div className="icon-item"></div>
              <div className="icon-item"></div>
            </div>
          </div>

          <div className="hero-center">
            <div className="building-frame">
              <img 
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800" 
                alt="Modern Building" 
                className="building-image"
              />
              <div className="arrow-circle">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M8 24L24 8M24 8H12M24 8V20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="testimonial">
              <div className="stars">★★★★★</div>
              <div className="reviewer">
                <img src="https://i.pravatar.cc/150?img=12" alt="Andrew Carlos" className="avatar" />
                <span className="reviewer-name">Andrew Carlos</span>
              </div>
              <p className="review-text">
                "The tranquility and natural elements integrated into their properties align perfectly with my values"
              </p>
            </div>

            <div className="stats">
              <div className="stat-item">
                <h3 className="stat-number"><sup>+</sup>500k</h3>
                <p className="stat-label">Happy user</p>
              </div>
              <div className="stat-item">
                <h3 className="stat-number"><sup>+</sup>100k</h3>
                <p className="stat-label">Our partner</p>
              </div>
            </div>

            <div className="scroll-indicator">↓</div>
            
            <div className="qr-code">
              <div className="qr-placeholder"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Search Hero Section */}
      <section className="modern-search-hero">
        <div className="modern-hero-container">
          {/* Left Side - Search Content */}
          <div className="hero-search-content">
            {/* Category Pills */}
            <div className="category-pills">
              <button className="pill-btn active">House</button>
              <button className="pill-btn">Appartement</button>
              <button className="pill-btn">Residential</button>
              <button className="pill-btn arrow-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Main Heading */}
            <h1 className="hero-main-heading">
              Are you<br />
              looking<br />
              for<span className="heading-accent">–</span>
            </h1>

            {/* Search Bar */}
            <div className="hero-search-wrapper">
              <input 
                type="text" 
                placeholder="Search Location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hero-search-input"
              />
              <button className="hero-search-btn">
                <FaSearch />
              </button>
            </div>

            {/* Description */}
            <p className="hero-description-text">
              With its square floor plan, cubist shape and impressive 216 m² of living space, Heid not only offers amazing views over the Rhine, but also an exceptionally harmonious room layout.
            </p>

            {/* Agent Link */}
            <div className="hero-agent-link">
              <span className="agent-bullet">●</span>
              <span className="agent-text">AGENTS</span>
            </div>
          </div>

          {/* Right Side - Property Card & Text */}
          <div className="hero-right-content">
            {/* Featured Property Card */}
            <div className="featured-property-card">
              <div className="property-card-image">
                <img 
                  src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600" 
                  alt="Property"
                />
              </div>
              <div className="property-card-info">
                <h3>1802 (From 1082 to 1899 Odd) Forest City RD, Forest City TWP, ME</h3>
                <p className="property-card-time">Today, 9 hours ago</p>
              </div>
              <button className="property-card-add">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 5V15M5 10H15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Large Aesthetic Text */}
            <div className="hero-aesthetic-text">
              <span className="aesthetic-word">a</span>
              <span className="aesthetic-word">aesthetic</span>
              <span className="aesthetic-word">
                <span className="aesthetic-accent">–</span>home?
              </span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="hero-bottom-section">
          <p className="bottom-description">
            Embedded in the natural hillside location, carefully designed recesses in the building create marvellous outdoor areas that seamlessly connect the interior with the surrounding landscape.
          </p>
        </div>

        {/* Property Cards Grid */}
        <div className="property-cards-grid">
          <div className="property-location-card dark-card">
            <div className="card-location">
              <p className="location-name">Königswinter,</p>
              <p className="location-country">Germany</p>
            </div>
            <div className="card-size">664 m²</div>
            <div className="card-footer">
              <span className="card-code">AG24K</span>
              <span className="card-floors">3 floor</span>
            </div>
          </div>

          <div className="property-location-card dark-card">
            <div className="card-location">
              <p className="location-name">Kolkata,</p>
              <p className="location-country">India</p>
            </div>
            <div className="card-size highlight">216 m²</div>
            <div className="card-footer">
              <span className="card-code">MC20K</span>
              <span className="card-floors">5 floor</span>
            </div>
          </div>

          <div className="property-location-card image-card">
            <img 
              src="https://images.unsplash.com/photo-1504615755583-2916b52192a3?w=400" 
              alt="Construction"
            />
          </div>

          <div className="property-location-card dark-card">
            <div className="card-location">
              <p className="location-name">Mumbai,</p>
              <p className="location-country">India</p>
            </div>
            <div className="card-size">420 m²</div>
            <div className="card-footer">
              <span className="card-code">Y2KC</span>
              <span className="card-floors">2 floor</span>
            </div>
          </div>

          <div className="property-location-card dark-card">
            <div className="card-location">
              <p className="location-name">Delhi,</p>
              <p className="location-country">India</p>
            </div>
            <div className="card-size">548 m²</div>
            <div className="card-footer">
              <span className="card-code">TK23K</span>
              <span className="card-floors">8 floor</span>
            </div>
          </div>
        </div>

        {/* Filter Section - Only show when toggled */}
        {showFilters && (
          <div className="modern-filters-overlay">
            <div className="modern-filters-container">
              <div className="filters-header">
                <h3>Filter Properties</h3>
                <button onClick={() => setShowFilters(false)} className="close-filters">
                  <FaTimes />
                </button>
              </div>
              
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="all">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
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
              </div>

              <button
                className="apply-filters-btn"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </section>

{/* Market Insights Section */}
<section className="market-insights-section">
  <div className="explore-container">
    <div className="insights-grid">
      
      {/* Left Column - Stats Cards */}
      <div className="insights-left">
        {/* Main Stats Card */}
        <div className="stats-card main-stats">
          <div className="card-header">
            <h3>Today's Market Activity</h3>
          </div>
          <div className="circular-progress">
            <svg viewBox="0 0 200 200" className="progress-ring">
              <circle cx="100" cy="100" r="80" className="progress-bg" />
              <circle cx="100" cy="100" r="80" className="progress-residential" strokeDasharray="314 188" />
              <circle cx="100" cy="100" r="80" className="progress-commercial" strokeDasharray="188 314" strokeDashoffset="-314" />
            </svg>
            <div className="progress-center">
              <div className="progress-value">571</div>
              <div className="progress-label">Total Sales</div>
            </div>
          </div>
          <div className="property-types">
            <div className="property-type-item">
              <div className="type-icon residential-icon">
                <Home size={24} />
              </div>
              <div className="type-label">Residential</div>
              <div className="type-value">293</div>
            </div>
            <div className="property-type-item">
              <div className="type-icon commercial-icon">
                <Building2 size={24} />
              </div>
              <div className="type-label">Commercial</div>
              <div className="type-value">161</div>
            </div>
            <div className="property-type-item">
              <div className="type-icon luxury-icon">
                <Crown size={24} />
              </div>
              <div className="type-label">Luxury</div>
              <div className="type-value">117</div>
            </div>
          </div>
        </div>

        {/* Transactions Card */}
        <div className="stats-card transactions-card">
          <div className="card-header">
            <h3>Billing & Transactions</h3>
            <button className="refresh-btn">
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
          <div className="transaction-list">
            <div className="transaction-item">
              <span className="transaction-label">Payment Received</span>
              <span className="transaction-percentage">94.6%</span>
              <span className="transaction-value">79,615</span>
            </div>
            <div className="transaction-item">
              <span className="transaction-label">Invoice Created</span>
              <span className="transaction-percentage">5.1%</span>
              <span className="transaction-value">4,292</span>
            </div>
            <div className="transaction-item">
              <span className="transaction-label">Cancelled</span>
              <span className="transaction-percentage">0.3%</span>
              <span className="transaction-value">253</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Main Dashboard */}
      <div className="insights-right">
        {/* Target Sales Breakdown */}
        <div className="dashboard-card">
          <div className="dashboard-header">
            <h2>Target Sales Breakdown</h2>
            <div className="view-toggle">
              <button>Daily</button>
              <button>Weekly</button>
              <button className="active">Monthly</button>
              <button>Annually</button>
            </div>
          </div>
          
          <div className="sales-summary">
            <div className="total-value">184,160</div>
            <div className="total-label">Total Ticket Sales</div>
          </div>

          {/* Property Type Breakdown */}
          <div className="breakdown-bars">
            <div className="breakdown-item">
              <div className="breakdown-label">Residential</div>
              <div className="breakdown-bar">
                <div className="bar-fill residential-fill" style={{width: '35.1%'}}></div>
              </div>
              <div className="breakdown-stats">35.1% · 64,640 ticket</div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-label">Commercial</div>
              <div className="breakdown-bar">
                <div className="bar-fill commercial-fill" style={{width: '57%'}}></div>
              </div>
              <div className="breakdown-stats">57% · 104,971 ticket</div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-label">Luxury</div>
              <div className="breakdown-bar">
                <div className="bar-fill luxury-fill" style={{width: '7.9%'}}></div>
              </div>
              <div className="breakdown-stats">7.9% · 14,549 ticket</div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="trend-chart">
            <svg viewBox="0 0 800 200" className="line-chart">
              <polyline 
                points="0,150 50,140 100,120 150,130 200,110 250,100 300,90 350,85 400,95 450,80 500,70 550,75 600,65 650,60 700,70 750,80 800,75"
                className="trend-line"
              />
              <circle cx="400" cy="95" r="4" className="trend-point" />
            </svg>
            <div className="trend-tooltip">
              <div className="tooltip-date">5 September 2025</div>
              <div className="tooltip-value">491 <span>tickets sales</span></div>
              <div className="tooltip-breakdown">
                <span className="residential-percent">43.2%</span>
                <span className="commercial-percent">27.5%</span>
                <span className="luxury-percent">29.3%</span>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="bottom-stats">
            <div className="stat-item">
              <div className="stat-label">Residential</div>
              <div className="stat-value">43.2% · 212 ticket</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Commercial</div>
              <div className="stat-value">27.5% · 135 ticket</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Luxury</div>
              <div className="stat-value">29.3% · 144 ticket</div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="bottom-row">
          {/* Top Performing Locations */}
          <div className="performing-card">
            <h3>Top Performing Locations</h3>
            <div className="location-list">
              {[
                { country: 'Mumbai', flag: 'IN', percentage: '23.58%', value: '43,435' },
                { country: 'Bangalore', flag: 'IN', percentage: '18.72%', value: '34,471' },
                { country: 'Delhi', flag: 'IN', percentage: '13.89%', value: '25,582' },
                { country: 'Pune', flag: 'IN', percentage: '10.54%', value: '19,411' },
                { country: 'Other', flag: 'Globe', percentage: '33.98%', value: '62,579' }
              ].map((loc, i) => (
                <div key={i} className="location-item">
                  <span className="location-flag">
                    {loc.flag === 'IN' && <MapPin size={18} />}
                    {loc.flag === 'Globe' && <Globe size={18} />}
                  </span>
                  <span className="location-name">{loc.country}</span>
                  <span className="location-percentage">{loc.percentage}</span>
                  <span className="location-value">{loc.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Retention Cohorts */}
          <div className="retention-card">
            <div className="retention-header">
              <h3>User Retention Cohorts</h3>
              <button className="report-btn">
                Get Report for <ChevronDown size={14} />
              </button>
            </div>
            <div className="retention-value">40%</div>
            <div className="retention-label">After 6 month<br/>February - September</div>
            <div className="cohort-grid">
              {Array.from({length: 12}).map((_, i) => (
                <div key={i} className="cohort-column">
                  {Array.from({length: 8}).map((_, j) => (
                    <div 
                      key={j} 
                      className={`cohort-cell ${j < 4 ? 'first-time' : 'loyal'}`}
                      style={{opacity: 0.3 + (Math.random() * 0.7)}}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="cohort-legend">
              <span><span className="legend-box first-time"></span> First-Time Buyers</span>
              <span><span className="legend-box loyal"></span> Loyal Customers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Broker Benefits Section */}
      <section className="broker-benefits-section dark-theme">
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

jsx{/* Modern Search Hero Section */}
<section className="modern-search-hero">
  {/* ... existing modern search hero code ... */}
</section>

{/* ADD THIS NEW SECTION HERE */}
<section className="architecture-showcase-section">
  <div className="explore-container">
    <div className="showcase-grid">
      {/* Rustic Charm */}
      <div className="showcase-card card-small">
        <img 
          src="https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800" 
          alt="Rustic Charm" 
          className="card-image"
        />
        <div className="card-overlay">
          <h3 className="card-title">rustic charm</h3>
        </div>
      </div>

      {/* Woodland Haven */}
      <div className="showcase-card card-small">
        <img 
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800" 
          alt="Woodland Haven" 
          className="card-image"
        />
        <div className="card-overlay">
          <h3 className="card-title">Woodland Haven</h3>
        </div>
      </div>

      {/* Luminous Urban */}
      <div className="showcase-card card-large">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800" 
          alt="Luminous Urban" 
          className="card-image"
        />
        <div className="card-overlay">
          <h3 className="card-title">Luminous Urban</h3>
        </div>
      </div>

      {/* Luminous Urban Abode - Info Card */}
      <div className="info-card">
        <h2 className="info-title">Luminous Urban Abode</h2>
        <p className="info-description">
          A peaceful escape with sweeping views of the bustling city
        </p>

        <div className="info-stats">
          <div className="stat-item">
            <div className="stat-value">645 <span className="stat-unit">sq.m.</span></div>
            <div className="stat-label">Total area</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">2-3</div>
            <div className="stat-label">Room</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">2024</div>
            <div className="stat-label">Year</div>
          </div>
        </div>

        <button className="learn-more-btn">
          <span>Learn more</span>
          <div className="btn-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
      </div>

      {/* Urban Skyline */}
      <div className="showcase-card card-large">
        <img 
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800" 
          alt="Urban Skyline" 
          className="card-image"
        />
        <div className="card-overlay">
          <h3 className="card-title">Urban Skyline</h3>
        </div>
      </div>
    </div>
  </div>
</section>
      {/* CTA Section */}
      <section className="explore-cta contact-style">
        <div className="explore-container">
          <h2>Ready to Find Your Dream Property</h2>
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