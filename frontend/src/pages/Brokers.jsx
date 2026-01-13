import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FaSearch, FaArrowLeft, FaArrowRight, FaCheckCircle, FaUserTie, FaAward, FaChartLine, FaClipboardList, FaUsers, FaComments } from 'react-icons/fa';
import Navbar from "../components/Navbar";
import PageTransition from '../components/PageTransition';
import './Brokers.css';

const Brokers = () => {
  const [brokers, setBrokers] = useState([]);
  const [filteredBrokers, setFilteredBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const cities = [...new Set(brokers.map(b => b.servingCities).filter(Boolean))];
  const specializations = [...new Set(brokers.flatMap(b => b.specialization || []))];

  // Get featured brokers
  const featuredBrokers = brokers.filter(broker => broker.isFeatured);
  
  // Get best agent
  const bestAgent = brokers.find(broker => broker.isBestAgent);

  // Get hero agents (first 3 verified brokers)
  const heroAgents = brokers.slice(0, 3);

  useEffect(() => {
    filterBrokers();
  }, [searchTerm, selectedCity, selectedSpecialization, brokers]);

  useEffect(() => {
    fetchBrokers();
  }, []);

  const fetchBrokers = async () => {
    try {
      const { data } = await api.get('/brokers');
      const verifiedBrokers = data.filter(broker => broker.verificationStatus === 'verified');
      setBrokers(verifiedBrokers);
      setFilteredBrokers(verifiedBrokers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching brokers:', error);
      setLoading(false);
    }
  };

  const filterBrokers = () => {
    let filtered = [...brokers];

    if (searchTerm) {
      filtered = filtered.filter(broker => 
        broker.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        broker.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        broker.servingCities?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(broker => broker.servingCities === selectedCity);
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(broker => 
        broker.specialization?.includes(selectedSpecialization)
      );
    }

    setFilteredBrokers(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedSpecialization('');
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    // Scroll to brokers grid section
    document.querySelector('.brokers-search-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 370; // card width + gap
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <div className="brokers-page-dark">
          {/* Hero Section */}
          <div className="brokers-hero-dark">
            <div className="hero-content-brokers">
              <div className="hero-label">
                <span className="hero-label-icon"></span>
                <span>VERIFIED PROFESSIONALS</span>
              </div>
              
              <h1>
                Find Your Perfect
                <span className="hero-emoji">🏠</span>
                Real Estate Agent
              </h1>
              
              <p className="hero-description">
                Connect with top-rated, verified real estate professionals in your area. 
                Whether buying, selling, or investing, find the expert guidance you need.
              </p>

              <form onSubmit={handleHeroSearch} className="hero-search-form">
                <div className="hero-select-wrapper">
                  <label className="hero-select-label">Location</label>
                  <select 
                    className="hero-select"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    <option value="">Select City</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="hero-select-wrapper">
                  <label className="hero-select-label">Specialization</label>
                  <select 
                    className="hero-select"
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                  >
                    <option value="">Select Type</option>
                    {specializations.map((spec, index) => (
                      <option key={index} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div className="hero-select-wrapper">
                  <label className="hero-select-label">Price Range</label>
                  <select className="hero-select">
                    <option value="">Any Price</option>
                    <option value="0-500k">$0 - $500K</option>
                    <option value="500k-1m">$500K - $1M</option>
                    <option value="1m+">$1M+</option>
                  </select>
                </div>

                <button type="submit" className="hero-search-btn">
                  <FaSearch />
                </button>
              </form>

              <div className="hero-verified-section">
                <h3 className="hero-verified-title">
                  <FaCheckCircle style={{ color: '#a3e635', marginRight: '0.5rem' }} />
                  All Agents Verified
                </h3>
                <p className="hero-verified-description">
                  Every agent on our platform is thoroughly vetted and verified for your peace of mind.
                </p>
              </div>
            </div>

            <div className="hero-agents-grid">
              {heroAgents.map((agent, index) => (
                <div key={agent._id} className="hero-agent-card">
                  {agent.photo ? (
                    <img src={agent.photo} alt={agent.userId?.name} className="hero-agent-image" />
                  ) : (
                    <div className="hero-agent-image" style={{ 
                      background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4rem',
                      fontWeight: '700',
                      color: '#fff'
                    }}>
                      {agent.userId?.name?.charAt(0)}
                    </div>
                  )}
                  <div className="hero-agent-badge">VERIFIED</div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Brokers Sliding Section */}
          {featuredBrokers.length > 0 && (
            <div className="featured-brokers-section">
              <div className="featured-section-header">
                <h2>Featured Agents</h2>
                <p>Hand-picked professionals with proven track records</p>
              </div>

              <div className="featured-brokers-slider">
                <div className="slider-track" ref={sliderRef}>
                  {featuredBrokers.map((broker) => (
                    <div key={broker._id} className="featured-broker-card">
                      <div className="featured-broker-image">
                        {broker.photo ? (
                          <img src={broker.photo} alt={broker.userId?.name} className="featured-broker-photo" />
                        ) : (
                          <div className="featured-broker-placeholder">
                            {broker.userId?.name?.charAt(0)}
                          </div>
                        )}
                        <div className="featured-broker-badge">FEATURED</div>
                        <div className="featured-broker-info">
                          <h3 className="featured-broker-name">{broker.userId?.name}</h3>
                          <p className="featured-broker-role">{broker.specialization?.[0] || 'Real Estate Agent'}</p>
                          <div className="featured-broker-company">
                            <div className="featured-broker-company-logo">
                              {broker.company?.charAt(0) || 'R'}
                            </div>
                            <span className="featured-broker-company-name">{broker.company || 'Real Estate Co.'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="slider-controls">
                  <button className="slider-btn" onClick={() => scrollSlider('left')}>
                    <FaArrowLeft />
                  </button>
                  <button className="slider-btn" onClick={() => scrollSlider('right')}>
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Best Agent Section */}
          {bestAgent && (
            <div className="best-agent-section">
              <div className="best-agent-container">
                <div className="best-agent-content">
                  <h2 className="best-agent-title">Agent of the Month</h2>
                  <p className="best-agent-description">
                    Meet our top-performing agent who has consistently delivered exceptional 
                    results and outstanding service to clients. Recognized for excellence in 
                    real estate transactions and customer satisfaction.
                  </p>
                </div>

                <div className="best-agent-visual">
                  <div className="best-agent-card">
                    <div className="best-agent-image">
                      {bestAgent.photo ? (
                        <img src={bestAgent.photo} alt={bestAgent.userId?.name} className="best-agent-photo" />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '8rem',
                          fontWeight: '700',
                          color: '#fff'
                        }}>
                          {bestAgent.userId?.name?.charAt(0)}
                        </div>
                      )}
                      <div className="best-agent-badge">BEST AGENT</div>
                    </div>
                    <div className="best-agent-info">
                      <h3 className="best-agent-name">{bestAgent.userId?.name}</h3>
                      <p className="best-agent-role">{bestAgent.specialization?.[0] || 'Real Estate Expert'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Why Use Our Agents Section */}
          <div className="why-use-agents-section">
            <div className="why-use-container">
              <div className="why-use-image-side">
                <p className="why-use-section-label">WHY CHOOSE US</p>
                <div className="why-use-image-wrapper">
                  {brokers[0]?.photo ? (
                    <img src={brokers[0].photo} alt="Agent" className="why-use-agent-photo" />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '500px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '8rem',
                      fontWeight: '700',
                      color: '#fff'
                    }}>
                      {brokers[0]?.userId?.name?.charAt(0) || 'A'}
                    </div>
                  )}
                </div>
              </div>

              <div className="why-use-content-side">
                <h2 className="why-use-main-title">Why Work With Our Verified Agents?</h2>
                <p className="why-use-description">
                  Our platform connects you with the best real estate professionals who are 
                  committed to helping you achieve your property goals.
                </p>

                <div className="why-use-features-list">
                  <div className="why-use-feature-item">
                    <div className="feature-icon-wrapper">
                      <FaCheckCircle />
                    </div>
                    <div className="feature-content">
                      <h3 className="feature-title">Verified Professionals</h3>
                      <p className="feature-description">
                        All agents undergo rigorous verification to ensure they meet our high 
                        standards of professionalism and expertise.
                      </p>
                    </div>
                  </div>

                  <div className="why-use-feature-item">
                    <div className="feature-icon-wrapper">
                      <FaUserTie />
                    </div>
                    <div className="feature-content">
                      <h3 className="feature-title">Local Market Experts</h3>
                      <p className="feature-description">
                        Our agents have deep knowledge of local markets and can provide 
                        invaluable insights for your real estate decisions.
                      </p>
                    </div>
                  </div>

                  <div className="why-use-feature-item">
                    <div className="feature-icon-wrapper">
                      <FaChartLine />
                    </div>
                    <div className="feature-content">
                      <h3 className="feature-title">Proven Track Record</h3>
                      <p className="feature-description">
                        Work with agents who have demonstrated success in helping clients 
                        buy, sell, and invest in properties.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="brokers-search-section">
            <div className="search-container-brokers">
              <div className="search-input-wrapper-brokers">
                <FaSearch className="search-icon-brokers" />
                <input
                  type="text"
                  placeholder="Search by name, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input-brokers"
                />
              </div>

              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="filter-select-brokers"
              >
                <option value="">All Cities</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>

              <select 
                value={selectedSpecialization} 
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="filter-select-brokers"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec, index) => (
                  <option key={index} value={spec}>{spec}</option>
                ))}
              </select>

              <button className="btn-reset-brokers" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          </div>

          {/* Brokers Grid */}
          <div className="brokers-container-dark">
            {filteredBrokers.length === 0 ? (
              <div className="no-results-brokers">
                <h2>No Brokers Found</h2>
                <p>Try adjusting your filters or search terms</p>
                <button className="btn-clear-filters" onClick={resetFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="brokers-grid-dark">
                {filteredBrokers.map((broker) => (
                  <div key={broker._id} className="broker-card-dark">
                    <div className="broker-image-container">
                      {broker.photo ? (
                        <img src={broker.photo} alt={broker.userId?.name} className="broker-photo-dark" />
                      ) : (
                        <div className="broker-photo-placeholder-dark">
                          {broker.userId?.name?.charAt(0)}
                        </div>
                      )}
                      <div className="broker-overlay-dark">
                        <div className="broker-name-overlay">
                          <h3>{broker.userId?.name}</h3>
                          <p>{broker.specialization?.[0] || 'Real Estate Agent'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* How It Works Section - Always appears at the end */}
          <div className="how-it-works-section">
            <div className="how-it-works-container">
              <div className="how-it-works-header">
                <h3 className="how-it-works-label">How It Works</h3>
                <h2 className="how-it-works-title">
                  Fast, simple, and <span className="highlight-text">tailored to you</span>
                </h2>
                <p className="how-it-works-subtitle">
                  We've made finding the right real estate agent effortless. Here's how it works
                </p>
              </div>

              <div className="how-it-works-grid">
                <div className="how-it-works-card">
                  <div className="how-it-works-icon">
                    <FaClipboardList />
                  </div>
                  <h3 className="how-it-works-card-title">Tell Us What You Need</h3>
                  <p className="how-it-works-card-description">
                    Fill out a short form with your location, budget, and the type of property you're interested in. The more we know, the better we can match.
                  </p>
                </div>

                <div className="how-it-works-card">
                  <div className="how-it-works-icon">
                    <FaUsers />
                  </div>
                  <h3 className="how-it-works-card-title">Get Matched with Top Agents</h3>
                  <p className="how-it-works-card-description">
                    Our smart matching system connects you with 1-3 trusted, local agents based on your needs. All agents are verified, rated, and experienced.
                  </p>
                </div>

                <div className="how-it-works-card">
                  <div className="how-it-works-icon">
                    <FaComments />
                  </div>
                  <h3 className="how-it-works-card-title">Chat or Schedule a Call</h3>
                  <p className="how-it-works-card-description">
                    Review agent profiles, read reviews, and start a conversation—your way. You can message directly, schedule a call, or book a tour instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Brokers;