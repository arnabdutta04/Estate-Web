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
 // PROTECTED - Requires login
const handleExploreClick = () => {
  if (user) {
    navigate("/properties");
  } else {
    navigate("/login");
  }
};

// PROTECTED - Requires login
const handlePropertyTypeClick = (propertyType) => {
  if (user) {
    navigate("/properties", { state: { filter: propertyType } });
  } else {
    navigate("/login");
  }
};

// PUBLIC - No login required
const handleExplorePageClick = () => {
  navigate("/explore");
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
{/* ================= MODERN HERO SECTION ================= */}
<section className="hero-modern-full">
  {/* Background Image */}
  <div className="hero-background-image">
    <img 
      src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600" 
      alt="Luxury Property Aerial View"
    />
    <div className="hero-overlay"></div>
  </div>
  
  {/* Hero Content */}
  <div className="hero-content-modern">
    <div className="hero-text-wrapper-modern">
      <h1 className="hero-title-modern">
        Find your<br />
        Dream Home <span className="highlight-yellow">Where Memories Begin</span>
      </h1>
      <p className="hero-description-modern">
        Discover thousands of properties, connect with verified brokers, and make 
        your real estate journey seamless and stress-free.
      </p>
    </div>
    
    {/* Trust Badges - Replaces Search Box */}
    <div className="hero-trust-badges">
      <div className="trust-badge-item">
        <svg 
          className="trust-badge-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" />
          <path 
            d="M7 12l3 3 7-7" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        <span className="trust-badge-text">100% Verified Listings</span>
      </div>

      <div className="trust-badge-item">
        <svg 
          className="trust-badge-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" />
          <path 
            d="M7 12l3 3 7-7" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        <span className="trust-badge-text">Trusted by Smart Users</span>
      </div>

      <div className="trust-badge-item">
        <svg 
          className="trust-badge-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" />
          <path 
            d="M7 12l3 3 7-7" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        <span className="trust-badge-text">24/7 Customer Support</span>
      </div>
    </div>
  </div>
</section>
   {/* ================= HOW IT WORKS - NEXIUM STYLE ================= */}
      <section className="how-it-works-nexium">
        <div className="nexium-works-container">
          {/* Header Section */}
          <div className="nexium-works-header">
            <div className="header-left-text">
              <p className="small-caption">Dolor quis dolor justo nunc in.</p>
              <p className="small-caption">Arcu aliquet velit ultricies</p>
              <p className="small-caption">lectus sem. Cras praesent mus</p>
            </div>
            
            <div className="header-main-title">
              <h2>About Us</h2>
              <p className="subtitle-nexium">
                The Journey of Finding Your Dream Property
              </p>
            </div>

            <div className="header-right-text">
              <p className="description-text">
                Egestas quisque viverra adipiscing at dictus dolor
                vitae potenti quis. Praesent mi eu malesuada blis.
                Consectetur ullamcorper in donec donec.
              </p>
            </div>
          </div>

          {/* Decorative Line */}
          <div className="nexium-divider-line"></div>

          {/* Main Content Area with Images */}
          <div className="nexium-works-content">
            <div className="content-left-title">
              <h3>Simple, transparent,<br />and efficient</h3>
            </div>

            {/* Property Images */}
            <div className="property-images-grid">
              <div className="property-image-item">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600" 
                  alt="Modern Villa" 
                />
              </div>
              <div className="property-image-item">
                <img 
                  src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600" 
                  alt="Luxury Property" 
                />
              </div>
            </div>

            <div className="content-right-text">
              <p className="side-description">
                Egestas quisque viverra adipiscing at dictus dolor
                vitae potenti quis. Praesent mi eu malesuada blis.
                Consectetur ullamcorper in donec donec.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="nexium-works-footer">
            <h3>Ready to start your property journey?</h3>
            <button className="nexium-cta-btn">
              Explore Properties <span className="arrow-icon">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= PROPERTY TYPES ================= */}
      <section className="property-types-elegant">
        <div className="elegant-container">
          {/* Header Section */}
          <div className="elegant-header">
            <div className="elegant-header-left">
              <h2 className="elegant-main-title">Browse By Property Type</h2>
            </div>
            <div className="elegant-header-right">
              <p className="elegant-subtitle">
                Discover premium properties across residential, commercial, and luxury segments. 
                Each listing is verified and curated for your investment needs.
              </p>
            </div>
          </div>

          {/* Decorative Line */}
          <div className="elegant-divider"></div>

          {/* Property Grid */}
          <div className="elegant-properties-grid">
            {/* Residential */}
            <div 
              className="elegant-property-card"
              onClick={() => handlePropertyTypeClick('residential')}
            >
              <div className="elegant-property-image">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800" 
                  alt="Residential Property" 
                />
                <div className="elegant-image-overlay"></div>
                <button className="elegant-category-badge">Residential</button>
              </div>
              <div className="elegant-property-info">
                <h3 className="elegant-property-title">Residential</h3>
                <p className="elegant-property-subtitle">Modern Living</p>
                <div className="elegant-property-footer">
                  <div className="elegant-property-details">
                    <p className="elegant-description">
                      Premium residential properties with modern amenities. Perfect for families seeking 
                      comfort and style in prime locations.
                    </p>
                    <p className="elegant-count">5,000+ listings</p>
                  </div>
                  {!user && (
                    <div className="elegant-lock-badge">
                      <FaKey /> Login Required
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Commercial */}
            <div 
              className="elegant-property-card"
              onClick={() => handlePropertyTypeClick('commercial')}
            >
              <div className="elegant-property-image">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800" 
                  alt="Commercial Property" 
                />
                <div className="elegant-image-overlay"></div>
                <button className="elegant-category-badge">Commercial</button>
              </div>
              <div className="elegant-property-info">
                <h3 className="elegant-property-title">Commercial</h3>
                <p className="elegant-property-subtitle">Business Spaces</p>
                <div className="elegant-property-footer">
                  <div className="elegant-property-details">
                    <p className="elegant-description">
                      Strategic commercial spaces in high-traffic areas. Ideal for businesses 
                      looking to establish or expand their presence.
                    </p>
                    <p className="elegant-count">2,500+ listings</p>
                  </div>
                  {!user && (
                    <div className="elegant-lock-badge">
                      <FaKey /> Login Required
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Land & Plots */}
            <div 
              className="elegant-property-card"
              onClick={() => handlePropertyTypeClick('land')}
            >
              <div className="elegant-property-image">
                <img 
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800" 
                  alt="Land Property" 
                />
                <div className="elegant-image-overlay"></div>
                <button className="elegant-category-badge">Land & Plots</button>
              </div>
              <div className="elegant-property-info">
                <h3 className="elegant-property-title">Land & Plots</h3>
                <p className="elegant-property-subtitle">Investment Opportunities</p>
                <div className="elegant-property-footer">
                  <div className="elegant-property-details">
                    <p className="elegant-description">
                      Prime land parcels for development or investment. Verified titles with 
                      clear documentation and growth potential.
                    </p>
                    <p className="elegant-count">1,500+ listings</p>
                  </div>
                  {!user && (
                    <div className="elegant-lock-badge">
                      <FaKey /> Login Required
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Luxury Villas */}
            <div 
              className="elegant-property-card"
              onClick={() => handlePropertyTypeClick('luxury')}
            >
              <div className="elegant-property-image">
                <img 
                  src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800" 
                  alt="Luxury Villa" 
                />
                <div className="elegant-image-overlay"></div>
                <button className="elegant-category-badge">Luxury</button>
              </div>
              <div className="elegant-property-info">
                <h3 className="elegant-property-title">Luxury Villas</h3>
                <p className="elegant-property-subtitle">Exclusive Living</p>
                <div className="elegant-property-footer">
                  <div className="elegant-property-details">
                    <p className="elegant-description">
                      Ultra-premium villas with world-class amenities. Designed for those who 
                      demand the finest in architecture and lifestyle.
                    </p>
                    <p className="elegant-count">1,000+ listings</p>
                  </div>
                  {!user && (
                    <div className="elegant-lock-badge">
                      <FaKey /> Login Required
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
     {/* ================= MARKET INSIGHTS - CLEAN DESIGN ================= */}
      <section className="market-insights-clean">
        <div className="insights-container-clean">
          {/* Left Side - Content */}
          <div className="insights-left-clean">
            <h2 className="insights-title-clean">
              Real-Time Market Insights<br />
              and Data Analytics
            </h2>
            <p className="insights-description-clean">
              Access comprehensive market data and property valuations. Make informed 
              investment decisions backed by real-time trends, growth projections, and detailed 
              neighborhood analytics across all major cities.
            </p>
            <button 
              className="insights-cta-btn-clean"
              onClick={handleExplorePageClick}
            >
              <FaChartLine /> View Market Data
            </button>
          </div>

          {/* Right Side - Stats Card */}
          <div className="insights-right-clean">
            <div className="insights-stats-card-clean">
              {/* Stat 1 */}
              <div className="stat-item-clean">
                <div className="stat-icon-clean growth">
                  <FaChartLine />
                </div>
                <div className="stat-content-clean">
                  <div className="stat-value-clean">+18.3%</div>
                  <div className="stat-label-clean">Avg. Price Growth</div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="stat-item-clean">
                <div className="stat-icon-clean verified">
                  <FaCheckCircle />
                </div>
                <div className="stat-content-clean">
                  <div className="stat-value-clean">9,000+</div>
                  <div className="stat-label-clean">Verified Listings</div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="stat-item-clean">
                <div className="stat-icon-clean coverage">
                  <FaMapMarkedAlt />
                </div>
                <div className="stat-content-clean">
                  <div className="stat-value-clean">6 Cities</div>
                  <div className="stat-label-clean">Market Coverage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================= FEATURES ================= */}
      <section className="features-split-section">
        {/* Feature 1 - Yellow/Green with Images */}
        <div className="feature-split yellow-green">
          <div className="feature-split-content">
            <div className="feature-split-text">
              <h2 className="feature-split-title">
                Verified Brokers with Expert Market Knowledge
              </h2>
              <p className="feature-split-description">
                Connect with certified real estate professionals who understand your needs. 
                Our verified brokers bring years of experience and deep market insights. 
                They guide you through every step with transparency and expertise.
              </p>
              <button className="feature-discover-btn">
                <FaHandshake /> Discover More
              </button>
            </div>
            <div className="feature-split-images">
              <div className="feature-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600" 
                  alt="Modern Property" 
                />
              </div>
              <div className="feature-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600" 
                  alt="Luxury Home" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2 - Dark with Aerial Image */}
        <div className="feature-split dark">
          <div className="feature-split-content reverse">
            <div className="feature-split-text-dark">
              <h2 className="feature-split-title-dark">
                Easy Transactions with Complete Transparency
              </h2>
              <button className="feature-category-btn">
                <FaKey /> Seamless Process
              </button>
              <p className="feature-split-description-dark">
                Experience hassle-free buying, selling, and renting with our streamlined process. 
                Every transaction is backed by verified documentation, clear pricing, and complete 
                legal compliance for your peace of mind.
              </p>
            </div>
            <div className="feature-split-images-large">
              <div className="feature-image-large">
                <img 
                  src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200" 
                  alt="Aerial Property View" 
                />
                <div className="feature-image-caption">
                  Experience premium properties with verified documentation and transparent pricing
                </div>
              </div>
              <div className="feature-navigation-arrows">
                <button className="feature-nav-arrow left">
                  <FaArrowRight style={{ transform: 'rotate(180deg)' }} />
                </button>
                <button className="feature-nav-arrow right">
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ContactSection />
    </div>
  );
};

export default Welcome;