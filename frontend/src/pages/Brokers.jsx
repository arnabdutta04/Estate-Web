import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FaSearch, FaArrowLeft, FaArrowRight, FaCheckCircle, FaUserTie, FaAward, FaChartLine, FaClipboardList, FaUsers, FaComments, FaHome, FaBuilding, FaUserFriends } from 'react-icons/fa';
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
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const brokersPerPage = 9;
  const cities = [...new Set(brokers.map(b => b.servingCities).filter(Boolean))];
  const specializations = [...new Set(brokers.flatMap(b => b.specialization || []))];
  const indexOfLastBroker = currentPage * brokersPerPage;
  const indexOfFirstBroker = indexOfLastBroker - brokersPerPage;
  const currentBrokers = filteredBrokers.slice(indexOfFirstBroker, indexOfLastBroker);
  const totalPages = Math.ceil(filteredBrokers.length / brokersPerPage);
  const featuredBrokers = brokers.filter(broker => broker.isFeatured);
 const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handlePrevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const handleNextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
  const bestAgent = brokers.find(broker => broker.isBestAgent);

  // Get hero agents (first 5 verified brokers for grid)
  const heroAgents = brokers.slice(0, 5);

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
  const handleMessage = (broker) => {
  navigate(`/messages/${broker._id}`);
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

  if (selectedLanguage) {
    filtered = filtered.filter(broker => 
      broker.languages?.includes(selectedLanguage)
    );
  }

  setFilteredBrokers(filtered);
  setCurrentPage(1); // ADD THIS LINE - Reset to page 1 when filters change
};

 const resetFilters = () => {
  setSearchTerm('');
  setSelectedCity('');
  setSelectedSpecialization('');
  setSelectedLanguage('');
  setCurrentPage(1); // ADD THIS LINE - Reset to page 1
};

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 370;
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
        <div className="brokers-page-nestico">
          {/* Individual Broker Hero Section - FIXED */}
           {/* Metro Living Hero Section */}
                 <div className="hero-container">
                   <div className="hero-content">
                     <div className="hero-left">
                       <h1 className="hero-title">
                         YOUR<br />Agent Is Here
                       </h1>
                       <button 
                         className="cta-button"
                           onClick={() => navigate('/contact')}
                            >

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
                           "WE are here to help you for youre best and dream investment."
                         </p>
                       </div>
           
                       <div className="stats">
                         <div className="stat-item">
                           <h3 className="stat-number"><sup>+</sup>50+</h3>
                           <p className="stat-label">Happy User</p>
                         </div>
                         <div className="stat-item">
                           <h3 className="stat-number"><sup>+</sup>10+</h3>
                           <p className="stat-label">Our partner</p>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
          {/* MAIN SEARCH SECTION */}
          <div className="brokers-list-section-grnata">
            <div className="brokers-list-container-grnata">
              <div className="brokers-list-header-grnata">
                <div>
                  <h2 className="brokers-list-title-grnata">Find an Agent</h2>
                  <p className="brokers-list-subtitle-grnata">
                    Let Propify finder find you a local real estate agent, and chat instantly.
                  </p>
                </div>
              </div>

              {/* MAIN SEARCH BAR */}
              <div className="brokers-search-bar-grnata">
                <select 
                  value={selectedCity} 
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="filter-select-grnata"
                >
                  <option value="">Agent Area</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </select>

                <select 
                  value={selectedSpecialization} 
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="filter-select-grnata"
                >
                  <option value="">Specialties</option>
                  {specializations.map((spec, index) => (
                    <option key={index} value={spec}>{spec}</option>
                  ))}
                </select>

                <select 
                  value={selectedLanguage} 
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="filter-select-grnata"
                >
                  <option value="">Language</option>
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="hindi">Hindi</option>
                  <option value="arabic">Arabic</option>
                </select>

                <div className="search-input-wrapper-grnata">
                  <FaSearch className="search-icon-grnata" />
                  <input
                    type="text"
                    placeholder="Agent name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input-grnata"
                  />
                </div>

                <button className="btn-search-grnata" onClick={() => filterBrokers()}>
                  Search
                </button>
              </div>

              <div className="brokers-info-bar-grnata">
                <span className="brokers-count-grnata">{filteredBrokers.length} agents available</span>
                <button className="btn-clear-filters-grnata" onClick={resetFilters}>
                  Clear Filters
                </button>
              </div>

              {/* Brokers Grid - FIXED with lazy loading */}
              {filteredBrokers.length === 0 ? (
                <div className="no-results-grnata">
                  <h3>No Agents Found</h3>
                  <p>Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="brokers-grid-grnata">
                  {currentBrokers.map((broker) => (
                    <div key={broker._id} className="broker-card-grnata">
                      <div className="broker-image-grnata">
                        {broker.photo ? (
                          <img 
                            src={broker.photo} 
                            alt={broker.userId?.name} 
                            className="broker-photo-grnata"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="broker-photo-placeholder-grnata"
                          style={{ display: broker.photo ? 'none' : 'flex' }}
                        >
                          {broker.userId?.name?.charAt(0)}
                        </div>
                      </div>
                      
                      <div className="broker-info-grnata">
                        <h3 className="broker-name-grnata">{broker.userId?.name}</h3>
                        <p className="broker-title-grnata">
                          {broker.specialization?.[0] || 'Senior Agent'} | {broker.servingCities || 'Miami, FL'}
                        </p>
                        <p className="broker-experience-grnata">10+ years in residential sales</p>
                        <p className="broker-rating-grnata">4.9/5 rating from 320 clients</p>
                      </div>

                      <div className="broker-actions-grnata">
                        <button
  className="btn-view-profile-grnata"
  onClick={() => navigate(`/brokers/${broker._id}`)}
>
  View Profile
</button>

                       <button 
  className="btn-message-grnata"
  onClick={() => handleMessage(broker)}
>
  Message {broker.userId?.name?.split(' ')[0]}
</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filteredBrokers.length > 0 && totalPages > 1 && (
  <div className="pagination-grnata">
    {/* Previous Arrow */}
    <button 
      className="pagination-arrow-grnata"
      onClick={handlePrevPage}
      disabled={currentPage === 1}
      style={{ 
        opacity: currentPage === 1 ? 0.5 : 1, 
        cursor: currentPage === 1 ? 'not-allowed' : 'pointer' 
      }}
    >
      ←
    </button>
    {/* Page Numbers - Dynamic based on totalPages */}
    {[...Array(Math.min(totalPages, 6))].map((_, index) => {
      const pageNumber = index + 1;
      return (
        <button 
          key={pageNumber}
          className={`pagination-number-grnata ${currentPage === pageNumber ? 'active' : ''}`}
          onClick={() => handlePageChange(pageNumber)}
        >
          {String(pageNumber).padStart(2, '0')}
        </button>
      );
    })}
    {/* Show ellipsis if more than 6 pages */}
    {totalPages > 6 && (
      <span className="pagination-ellipsis">...</span>
    )}
    
    {/* Next Arrow */}
    <button 
      className="pagination-arrow-grnata"
      onClick={handleNextPage}
      disabled={currentPage === totalPages}
      style={{ 
        opacity: currentPage === totalPages ? 0.5 : 1, 
        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' 
      }}
    >
      →
    </button>
  </div>
              )}
            </div>
          </div>
          
          {/* Featured Brokers Sliding Section - FIXED */}
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
                          <img 
                            src={broker.photo} 
                            alt={broker.userId?.name} 
                            className="featured-broker-photo"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="featured-broker-placeholder"
                          style={{ display: broker.photo ? 'none' : 'flex' }}
                        >
                          {broker.userId?.name?.charAt(0)}
                        </div>
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

          {/* Best Agent Section - FIXED */}
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
                        <img 
                          src={bestAgent.photo} 
                          alt={bestAgent.userId?.name} 
                          className="best-agent-photo"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div style={{
                        display: bestAgent.photo ? 'none' : 'flex',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '8rem',
                        fontWeight: '700',
                        color: '#fff'
                      }}>
                        {bestAgent.userId?.name?.charAt(0)}
                      </div>
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

          {/* Why Use Our Agents Section - FIXED */}
          <div className="why-use-agents-section">
            <div className="why-use-container">
              <div className="why-use-image-side">
                <p className="why-use-section-label">WHY CHOOSE US</p>
                <div className="why-use-image-wrapper">
                  {brokers[0]?.photo ? (
                    <img 
                      src={brokers[0].photo} 
                      alt="Agent" 
                      className="why-use-agent-photo"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div style={{
                    display: brokers[0]?.photo ? 'none' : 'flex',
                    width: '100%',
                    height: '500px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '8rem',
                    fontWeight: '700',
                    color: '#fff',
                    borderRadius: '20px'
                  }}>
                    {brokers[0]?.userId?.name?.charAt(0) || 'A'}
                  </div>
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

          {/* How It Works Section */}
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

          {/* Selling Your Home Section */}
<div className="selling-home-section">
  <div className="selling-home-container">
    <div className="selling-home-content">
      <h2 className="selling-home-title">Selling Your Home?</h2>
      <p className="selling-home-subtitle">A 5 Steps, Free Process with Expert Guidance</p>

      <div className="selling-steps-list">
        <div className="selling-step-item">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3 className="step-title">Home valuation</h3>
            <p className="step-description">
              Get a quick, accurate estimated value for your home and unbiased professional pricing guidance.
            </p>
          </div>
        </div>

        <div className="selling-step-item">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3 className="step-title">Agent matching</h3>
            <p className="step-description">
              We'll help you find a real estate agent from a vetted pool to list and sell your home for the most possible.
            </p>
          </div>
        </div>

        <div className="selling-step-item">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3 className="step-title">Listing preparation</h3>
            <p className="step-description">
              From staging tips to professional photography, we'll help you highlight your home in its photos.
            </p>
          </div>
        </div>

        <div className="selling-step-item">
          <div className="step-number">4</div>
          <div className="step-content">
            <h3 className="step-title">Evaluate offers</h3>
            <p className="step-description">
              Your agent evaluates bids, schedules tours, and secures the best deal for your home's sale.
            </p>
          </div>
        </div>

        <div className="selling-step-item">
          <div className="step-number">5</div>
          <div className="step-content">
            <h3 className="step-title">Closing</h3>
            <p className="step-description">
              We coordinate inspections, appraisals, and legal requirements so you can finish on your own timeline.
            </p>
          </div>
        </div>
      </div>
<button 
  className="btn-get-started"
  onClick={() => navigate('/register')}
>
  Let's get started
</button>
    </div>

    <div className="selling-home-image">
      <img 
        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop" 
        alt="Real estate consultation"
        className="consultation-image"
        loading="lazy"
      />
    </div>
  </div>
</div>

{/* Agent CTA Section */}
<div className="agent-cta-section">
  <div className="agent-cta-container">
    <div className="agent-cta-content">
      <div className="agent-cta-icon">
        <FaUserTie />
      </div>
      <div className="agent-cta-text">
        <h3 className="agent-cta-title">Are you an agent or a broker?</h3>
        <p className="agent-cta-description">Grow your business with the propify Select Network.</p>
      </div>
    </div>
    <button 
  className="btn-agent-cta"
  onClick={() => navigate('/register?role=broker')}
>
  Get Started
</button>
  </div>
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default Brokers;